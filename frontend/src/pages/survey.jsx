
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, GraduationCap, Laptop, Send, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import API from '../../API/API';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/themeToggle';

const sections = [
    {
        title: 'About you', subtitle: 'A little context about your studies.', questions: [
            { id: 'name', label: 'What should we call you?', type: 'text', placeholder: 'Your name' },
            { id: 'email', label: 'University email address', type: 'email', placeholder: 'you@university.edu' },
            { id: 'university', label: 'Which university do you attend?', type: 'text', placeholder: 'University name' },
            { id: 'studyLevel', label: 'What is your current study level?', type: 'select', options: ['Undergraduate', 'Postgraduate', 'Doctoral', 'Other'] },
            { id: 'year', label: 'What year of study are you in?', type: 'select', options: ['First year', 'Second year', 'Third year', 'Fourth year or above', 'Not applicable'] },
            { id: 'major', label: 'What is your major or programme?', type: 'text', placeholder: 'e.g. Computer Science' },
            { id: 'focus', label: 'Which area interests you most?', type: 'select', options: ['Software engineering', 'AI and machine learning', 'Cybersecurity', 'Data science', 'Networks and systems', 'Human-computer interaction', 'Other'] },
        ]
    },
    {
        title: 'Your tech experience', subtitle: 'Tell us how you learn and build.', questions: [
            { id: 'languages', label: 'Which programming languages have you used?', type: 'text', placeholder: 'e.g. JavaScript, Python, Java' },
            { id: 'experience', label: 'How long have you been programming?', type: 'select', options: ['I am just starting', 'Less than 1 year', '1–3 years', '3–5 years', 'More than 5 years'] },
            { id: 'projects', label: 'Have you built a project outside class?', type: 'radio', options: ['Yes', 'Not yet, but I would like to'] },
            { id: 'projectType', label: 'What kind of project would you like to build?', type: 'text', placeholder: 'e.g. A campus study app' },
            { id: 'tools', label: 'Which tools do you use most often?', type: 'text', placeholder: 'e.g. VS Code, GitHub, Figma' },
            { id: 'confidence', label: 'How confident are you debugging code?', type: 'select', options: ['I need support', 'Somewhat confident', 'Confident', 'Very confident'] },
            { id: 'learning', label: 'How do you prefer to learn new technical skills?', type: 'select', options: ['Hands-on projects', 'Lectures and reading', 'Study groups', 'Online tutorials', 'A mix of these'] },
        ]
    },
    {
        title: 'Campus & community', subtitle: 'Help us understand what would support you.', questions: [
            { id: 'access', label: 'Where do you usually access a computer for coursework?', type: 'select', options: ['My own laptop or desktop', 'University computer lab', 'Shared device', 'Mostly a phone or tablet', 'Other'] },
            { id: 'internet', label: 'How reliable is your internet access for study?', type: 'select', options: ['Very reliable', 'Usually reliable', 'Sometimes unreliable', 'Often unreliable'] },
            { id: 'clubs', label: 'Are you part of a technology club or society?', type: 'radio', options: ['Yes', 'No', 'I am interested'] },
            { id: 'events', label: 'Which campus tech events interest you?', type: 'text', placeholder: 'e.g. Hackathons, guest talks' },
            { id: 'challenge', label: 'What is your biggest challenge in learning tech?', type: 'textarea', placeholder: 'Share as much or as little as you like…' },
            { id: 'support', label: 'What support would help you succeed?', type: 'textarea', placeholder: 'Mentorship, lab access, study groups…' },
            { id: 'updates', label: 'May we contact you about student tech opportunities?', type: 'radio', options: ['Yes, please', 'No, thank you'] },
        ]
    },
];

function Field({ question, value, onChange }) {
    const common = { id: question.id, value: value || '', onChange: e => onChange(question.id, e.target.value) };
    const fieldClass = 'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:bg-slate-800 dark:focus:ring-violet-900/40';
    if (question.type === 'select') return <select {...common} className={fieldClass}><option value="">Choose an option</option>{question.options.map(x => <option key={x}>{x}</option>)}</select>;
    if (question.type === 'radio') return <div className="flex flex-wrap gap-2">{question.options.map(x => <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition ${value === x ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-200' : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`} key={x}><input className="accent-violet-600" type="radio" name={question.id} value={x} checked={value === x} onChange={e => onChange(question.id, e.target.value)} />{x}</label>)}</div>;
    if (question.type === 'textarea') return <textarea {...common} className={fieldClass} rows="3" placeholder={question.placeholder} />;
    return <input {...common} className={fieldClass} type={question.type} placeholder={question.placeholder} />;
}

export default function Survey() {
    const [dark, setDark] = useState(() => localStorage.theme === "dark" || (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches));
    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState({});
    const [busy, setBusy] = useState(false);
    const current = sections[page];
    const remaining = sections.length - page - 1;
    const update = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));
    useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);

    function next() {
        const missing = current.questions.filter(q => !String(answers[q.id] || '').trim());
        if (missing.length) { toast.error('A few answers are missing', { description: `Please complete the ${missing.length} remaining ${missing.length === 1 ? 'question' : 'questions'} on this page.` }); return; }
        setPage(p => Math.min(p + 1, sections.length - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    async function submit() {
        console.log(answers);
        const missing = current.questions.filter(q => !String(answers[q.id] || '').trim());
        if (missing.length) { toast.error('A few answers are missing', { description: `Please complete the ${missing.length} remaining ${missing.length === 1 ? 'question' : 'questions'} on this page.` }); return; }
        setBusy(true);
        console.log(answers);
        try {
            const res = await API.post('/responses', { body: answers });
            console.log('Response submitted:', res.data);
            toast.success('Thanks for sharing!', { description: 'Your response has been submitted.' });
            setAnswers({}); setPage(0);
        } catch (error) { toast.error('Submission failed', { description: error.message || 'Check that the server is running and try again.' }); }
        finally { setBusy(false); }
    }

    return (
        <>
            <Toaster position="top-center" richColors theme={dark ? 'dark' : 'light'} />
            <main className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
                <div className="mx-auto min-h-screen max-w-7xl px-5 sm:px-8 lg:px-17.5">
                    <header className="flex px-1 rounded-2xl h-18 sticky top-0  transition-colors z-10 dark:bg-slate-950 items-center justify-between border-b border-slate-200 dark:border-slate-800">
                        <span className="flex items-center gap-4">
                            <Link to="/login" className='flex items-center gap-0.5 text-sm font-medium text-slate-100 hover:text-slate-200 dark:text-slate-200 dark:hover:text-slate-300 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700 px-3 py-2 rounded-lg transition-colors'>
                                <ShieldCheck size={18} /> Admin
                            </Link>
                            <a className="flex items-center gap-2.5 font-display text-[17px] font-bold tracking-tight text-slate-800 dark:text-white" href="#top">
                                <span className="hidden sm:grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-none">
                                    <GraduationCap size={20} />
                                </span>
                                <span>Campus<span className="text-violet-600 dark:text-violet-400">Tech</span></span>
                            </a>
                        </span>

                        <div className="flex items-center gap-4">
                            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500 sm:flex">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Student pulse survey
                            </span>
                            <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
                        </div>
                    </header>
                    <div className="mx-auto grid w-full max-w-5xl flex-1 items-start gap-8 py-8 md:grid-cols-[245px_minmax(0,1fr)] md:gap-10 md:py-14 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-17.5" id="top">
                        <aside className="relative overflow-hidden py-1 md:sticky md:top-15 md:py-8">
                            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-500">
                                <span className="grid h-6 w-6 place-items-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                                    <Laptop size={14} />
                                </span>
                                BUILT FOR YOUR CAMPUS
                            </div>
                            <h1 className="mb-3 mt-4 font-display text-[42px] font-semibold leading-none tracking-[-2px] text-slate-800 dark:text-white md:mb-5 md:mt-8 md:text-[52px] lg:text-[58px]">
                                Tech starts
                                <br />with
                                <span className="text-violet-600 dark:text-violet-400"> you.</span>
                            </h1>
                            <p className="max-w-sm text-[13px] leading-7 text-slate-500 dark:text-slate-400 md:text-sm">Help us shape a stronger computer science community at your university. Your perspective makes a difference.</p>
                            <div className="mt-7 hidden h-px w-56 bg-slate-200 dark:bg-slate-800 md:block" />
                            <div className="mt-5 hidden items-center gap-3 text-[11px] text-slate-500 md:flex">
                                <div className="flex -space-x-1">
                                    <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-slate-50 bg-violet-100 font-mono text-[9px] text-violet-700 dark:border-slate-950 dark:bg-violet-950 dark:text-violet-200">CS</span>
                                    <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-slate-50 bg-emerald-100 font-mono text-[9px] text-emerald-700 dark:border-slate-950 dark:bg-emerald-950 dark:text-emerald-200">IT</span>
                                    <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-slate-50 bg-orange-100 font-mono text-[9px] text-orange-700 dark:border-slate-950 dark:bg-orange-950 dark:text-orange-200">AI</span>
                                </div>Made for curious minds
                            </div>
                        </aside>
                        <section className="min-w-0">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-700 sm:p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="font-mono text-[10px] tracking-widest text-violet-600 dark:text-violet-400">SECTION 0{page + 1}
                                            <span className="text-slate-400">/</span>
                                            03
                                        </span>
                                        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-800 dark:text-white">{current.title}</h2>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{current.subtitle}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 font-mono text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{String(page + 1).padStart(2, '0')}
                                        <span className="text-slate-400">— 03</span>
                                    </div>
                                </div>
                                <div className="my-6 flex gap-1.5" aria-label={`Section ${page + 1} of ${sections.length}`}>
                                    {sections.map((s, i) => <div key={s.title} className={`h-0.75 flex-1 rounded-full ${i <= page ? 'bg-violet-600' : 'bg-slate-100 dark:bg-slate-700'}`} />)}
                                </div>
                                <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                                    {current.questions.map((q, i) =>
                                        <div className="min-w-0" key={q.id}>
                                            <label className="mb-2 flex min-h-4.25 gap-2 text-[11px] font-semibold leading-relaxed text-slate-700 dark:text-slate-300" htmlFor={q.id}>
                                                <span className="font-mono text-[9px] text-slate-400">
                                                    {String(page * 7 + i + 1).padStart(2, '0')}
                                                </span>
                                                <span>{q.label}<span className="text-violet-400"> *</span></span>
                                            </label>
                                            <Field question={q} value={answers[q.id]} onChange={update} />
                                        </div>)}
                                </div>
                            </div>
                            <div className="mt-5 flex items-center justify-between px-1">
                                <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[11px] font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-300 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-violet-600" onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={page === 0}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                                    <div className="flex gap-1">
                                        {sections.map((_, i) =>
                                            <span key={i} className={`h-1.25 w-1.25 rounded-full ${i <= page ? 'bg-violet-500' : 'bg-slate-200 dark:bg-slate-700'}`} />)}
                                    </div>
                                    <span>
                                        {remaining === 0 ? 'Last page' : `${remaining} ${remaining === 1 ? 'page' : 'pages'} remaining`}
                                    </span>
                                </div>
                                {page < sections.length - 1 ?
                                    <button className="flex h-9 items-center gap-2 rounded-lg border border-violet-600 bg-violet-600 px-4 text-[11px] font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 dark:shadow-none" onClick={next}>
                                        Continue <ArrowRight size={16} />
                                    </button> :
                                    <button className="flex h-9 items-center gap-2 rounded-lg border border-violet-600 bg-violet-600 px-4 text-[11px] font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-70 dark:shadow-none" onClick={submit} disabled={busy}>
                                        {busy ? 'Sending…' : 'Submit form'} {busy ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" /> :
                                            <Send size={15} />}
                                    </button>}
                            </div>
                            <div className="mx-1 mt-5">
                                <div className="mb-2 flex justify-between font-mono text-[9px] tracking-widest text-slate-400">
                                    <span>YOUR PROGRESS</span>
                                    <span className="text-violet-600 dark:text-violet-400">
                                        {Math.round(((page + 1) / sections.length) * 100)}%
                                    </span>
                                </div>
                                <div className="h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div className="h-full rounded-full bg-linear-to-r from-violet-500 to-violet-700 transition-all duration-300" style={{ width: `${((page + 1) / sections.length) * 100}%` }} />
                                </div>
                            </div>
                            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                                <span className="grid h-4.5 w-4.25 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                                    <Check size={12} />
                                </span>
                                Your answers help improve student tech experiences.
                            </div>
                        </section>
                    </div>
                    <footer className="flex h-14 items-center justify-between border-t border-slate-200 font-mono text-[9px] tracking-wider text-slate-400 dark:border-slate-800">
                        <span>&copy; 2026 CampusTech&trade;</span>
                        <span>STUDENT VOICES, BETTER TECH</span>
                    </footer>
                </div>
            </main>
        </>
    )
}
