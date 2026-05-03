import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  CheckCircle,
  Code,
  FileText,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Map,
  MessageSquare,
  Rocket,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDisplayName } from '../lib/supabase';

const features = [
  {
    icon: Bot,
    title: 'Ask questions while you learn',
    text: 'Get quick explanations for HTML, CSS, JavaScript, React, backend concepts, APIs, and project bugs.',
  },
  {
    icon: Map,
    title: 'Follow clear roadmaps',
    text: 'Choose your goal and level, then get a practical learning path with phases, skills, and projects.',
  },
  {
    icon: FileText,
    title: 'Learn from shared notes',
    text: 'Read community tips, save useful ideas, and publish your own learning notes as you grow.',
  },
];

const learningTracks = [
  'Frontend foundations',
  'Responsive layouts',
  'JavaScript essentials',
  'React components',
  'Backend and APIs',
  'Portfolio projects',
];

const steps = [
  {
    title: 'Pick your path',
    text: 'Start with frontend, backend, full stack, or mobile depending on the kind of developer you want to become.',
  },
  {
    title: 'Learn with guidance',
    text: 'Use AI help, roadmaps, and community notes to understand concepts instead of memorizing random tutorials.',
  },
  {
    title: 'Build real projects',
    text: 'Turn lessons into portfolio-ready work so your learning has visible proof behind it.',
  },
];

export default function HomeNew() {
  const { user, profile } = useAuth();
  const displayName = getDisplayName(user, profile);

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-zinc-200 px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700">
              <Sparkles size={16} />
              AI-powered web development learning
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
              Learn web development with a smarter study companion.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              DevConnect helps beginners learn faster with AI coding support, personalized roadmaps, community notes, and practical projects that turn confusion into momentum.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                {user ? `Continue, ${displayName}` : 'Start learning free'}
                <ArrowRight size={19} />
              </Link>
              <Link
                to={user ? '/roadmap' : '/notes'}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-50"
              >
                {user ? 'Generate roadmap' : 'Explore notes'}
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-zinc-200 pt-6">
              <MiniStat value="AI" label="study help" />
              <MiniStat value="6+" label="core skills" />
              <MiniStat value="Project" label="focused" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950">
                  <Terminal size={21} />
                </div>
                <div>
                  <p className="font-semibold">Learning workspace</p>
                  <p className="text-sm text-zinc-400">Roadmaps, notes, and AI support</p>
                </div>
              </div>
              <Rocket size={22} className="text-zinc-300" />
            </div>

            <div className="rounded-xl bg-white p-4 text-zinc-950">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
                  <Code size={22} />
                </div>
                <div>
                  <p className="font-semibold">Frontend Starter Roadmap</p>
                  <p className="text-sm text-zinc-500">Beginner to first portfolio</p>
                </div>
              </div>
              <div className="space-y-3">
                {['HTML and semantic structure', 'CSS layouts and responsive design', 'JavaScript fundamentals', 'React components and state'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium">
                    <CheckCircle size={17} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <PreviewCard icon={MessageSquare} title="Ask AI" text="Explain a concept" />
              <PreviewCard icon={BookOpen} title="Notes" text="Save key ideas" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Why DevConnect</p>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950">Everything a beginner needs to stay unstuck.</h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              Web development has a lot of moving parts. DevConnect brings the guidance, structure, and practice into one calm workspace.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">What you can learn</p>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950">From first tags to full projects.</h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              Build a strong foundation first, then move into modern tools and real project work.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {learningTracks.map((track) => (
              <div key={track} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                  <GraduationCap size={20} />
                </div>
                <span className="font-semibold text-zinc-800">{track}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">How it works</p>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950">A simple path from learning to building.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-lg font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-zinc-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-950 px-4 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <Outcome icon={Globe} title="Understand the web" text="Learn how browsers, servers, APIs, and databases work together." />
          <Outcome icon={Target} title="Study with focus" text="Use roadmaps to avoid random tutorial-hopping." />
          <Outcome icon={Briefcase} title="Build portfolio work" text="Practice through projects that show what you can do." />
          <Outcome icon={TrendingUp} title="Keep improving" text="Track your activity and return to useful learning material." />
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
              {user ? 'Ready for your next lesson?' : 'Start learning web development today.'}
            </h2>
            <p className="mt-2 max-w-2xl text-zinc-600">
              {user
                ? 'Open your dashboard and continue with your chats, notes, and roadmaps.'
                : 'Create a free account and turn your web development learning into a guided routine.'}
            </p>
          </div>
          <Link
            to={user ? '/dashboard' : '/signup'}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-zinc-800"
          >
            {user ? 'Open dashboard' : 'Get started free'}
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-zinc-900">DevConnect AI</p>
          <div className="flex gap-4">
            <Link to="/notes" className="hover:text-zinc-950">Notes</Link>
            <Link to={user ? '/roadmap' : '/signup'} className="hover:text-zinc-950">Roadmap</Link>
            <Link to={user ? '/chat' : '/signup'} className="hover:text-zinc-950">AI Chat</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight text-zinc-950">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }: { icon: typeof Bot; title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-zinc-300">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-zinc-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{text}</p>
    </article>
  );
}

function PreviewCard({ icon: Icon, title, text }: { icon: typeof Bot; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <Icon size={20} className="mb-3 text-zinc-300" />
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-zinc-400">{text}</p>
    </div>
  );
}

function Outcome({ icon: Icon, title, text }: { icon: typeof Globe; title: string; text: string }) {
  return (
    <article>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-950">
        <Icon size={23} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </article>
  );
}
