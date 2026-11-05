import React, { useState } from 'react';
import { Plus, ThumbsUp, Vote, X } from 'lucide-react';
import toast from 'react-hot-toast';

const pollTypes = [
  { id: 'stay', label: 'Hotels & stays' },
  { id: 'dining', label: 'Dining & cafes' },
  { id: 'activity', label: 'Places & activities' },
  { id: 'other', label: 'Other' }
];

export default function GroupVoting({ destination = 'your destination' }) {
  const [polls, setPolls] = useState([]);
  const [activePollId, setActivePollId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pollType, setPollType] = useState('activity');
  const [question, setQuestion] = useState('');
  const [optionText, setOptionText] = useState('');

  const activePoll = polls.find((poll) => poll.id === activePollId) || null;

  const startPoll = (event) => {
    event.preventDefault();
    const options = [...new Set(optionText.split('\n').map((option) => option.trim()).filter(Boolean))];
    if (!question.trim()) {
      toast.error('Add a question before starting the poll.');
      return;
    }
    if (options.length < 2) {
      toast.error('Add at least two places or options for your group to compare.');
      return;
    }

    const poll = {
      id: `poll-${Date.now()}`,
      type: pollType,
      question: question.trim(),
      options: options.map((title, index) => ({ id: `${Date.now()}-${index}`, title, votes: 0 })),
      myVote: null
    };
    setPolls((currentPolls) => [...currentPolls, poll]);
    setActivePollId(poll.id);
    setQuestion('');
    setOptionText('');
    setShowCreateForm(false);
    toast.success('Group poll started with your options.');
  };

  const castVote = (optionId) => {
    if (!activePoll) return;
    setPolls((currentPolls) => currentPolls.map((poll) => {
      if (poll.id !== activePoll.id) return poll;
      return {
        ...poll,
        myVote: optionId,
        options: poll.options.map((option) => ({
          ...option,
          votes: option.votes + (option.id === optionId ? 1 : 0) - (option.id === poll.myVote ? 1 : 0)
        }))
      };
    }));
    toast.success('Your vote has been recorded.');
  };

  const closePoll = () => {
    setPolls((currentPolls) => currentPolls.filter((poll) => poll.id !== activePollId));
    setActivePollId(null);
    toast.success('Poll closed.');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
            <Vote className="h-4 w-4" /> Plan together · {destination}
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-[#14213D] sm:text-3xl">Group voting</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Start a poll with places your group actually wants to consider. Nothing is suggested or voted on until someone starts a poll.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm((open) => !open)}
          className="flex items-center gap-2 rounded-xl bg-[#14213D] px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreateForm ? 'Cancel' : 'Start a poll'}
        </button>
      </header>

      {showCreateForm && (
        <form onSubmit={startPoll} className="space-y-5 rounded-2xl border border-teal-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-bold text-slate-700">
              Poll category
              <select
                value={pollType}
                onChange={(event) => setPollType(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium outline-none focus:border-teal-500"
              >
                {pollTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-xs font-bold text-slate-700">
              Question
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={`What should we do in ${destination}?`}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium outline-none focus:border-teal-500"
                required
              />
            </label>
          </div>
          <label className="block space-y-1.5 text-xs font-bold text-slate-700">
            Poll options <span className="font-normal text-slate-500">(one place or choice per line; enter at least two)</span>
            <textarea
              value={optionText}
              onChange={(event) => setOptionText(event.target.value)}
              placeholder={`Add places your group suggested in ${destination}…`}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium outline-none focus:border-teal-500"
              required
            />
          </label>
          <button type="submit" className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700">
            Start group poll
          </button>
        </form>
      )}

      {polls.length > 0 && (
        <nav className="flex flex-wrap gap-2" aria-label="Active polls">
          {polls.map((poll) => (
            <button
              key={poll.id}
              onClick={() => setActivePollId(poll.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activePollId === poll.id ? 'bg-teal-600 text-white' : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {poll.question}
            </button>
          ))}
        </nav>
      )}

      {activePoll ? (
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                {pollTypes.find((type) => type.id === activePoll.type)?.label} · Poll in progress
              </span>
              <h2 className="mt-1 text-xl font-extrabold text-[#14213D]">{activePoll.question}</h2>
            </div>
            <button onClick={closePoll} className="self-start text-xs font-semibold text-slate-500 underline hover:text-rose-600 sm:self-auto">
              Close poll
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {activePoll.options.map((option) => {
              const isSelected = activePoll.myVote === option.id;
              return (
                <article key={option.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-bold text-[#14213D]">{option.title}</h3>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-500">{option.votes} {option.votes === 1 ? 'vote' : 'votes'}</span>
                    <button
                      onClick={() => castVote(option.id)}
                      aria-pressed={isSelected}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                        isSelected ? 'bg-teal-600 text-white' : 'border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" /> {isSelected ? 'Your vote' : 'Vote'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="text-xs text-slate-500">Options come from your group. Votes stay in this browser while this page is open and are not synced to other members.</p>
        </section>
      ) : !showCreateForm ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <Vote className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold text-[#14213D]">No poll has been started</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Start a poll and add the hotels, restaurants, or activities your group wants to vote on. No random places are preloaded.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-5 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            Create the first poll
          </button>
        </section>
      ) : null}
    </div>
  );
}
