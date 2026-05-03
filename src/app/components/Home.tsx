import { Link } from 'react-router-dom';
import { Sparkles, Brain, Rocket, Users, Code, BookOpen, MessageSquare, Map } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
            {/* Left Side - Content */}
            <div className="space-y-8 z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                <span className="text-2xl">🚀</span>
                <span className="text-sm font-semibold text-gray-700">
                  AI-Powered Learning Platform
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                Learn Web Development
                <br />
                <span className="text-gray-700">The Smart Way</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                Master coding with AI-powered guidance, personalized roadmaps, and instant help.
                Built for beginners who want to learn fast.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="group relative px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                    <Sparkles size={18} />
                  </span>
                </Link>
                <Link
                  to="/chat"
                  className="px-8 py-4 rounded-xl font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md transition-all"
                >
                  Try AI Chat →
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">JD</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">SK</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">AL</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">1000+ students learning</p>
                  <p className="text-sm text-gray-600">Join the community today</p>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Main Glassmorphic Card */}
              <div className="relative w-full max-w-lg">
                {/* Central Dashboard Mockup */}
                <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500"></div>
                        <div className="space-y-1">
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                          <div className="h-2 w-16 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>

                    {/* Code Preview */}
                    <div className="bg-gray-900 rounded-xl p-4 space-y-2 font-mono text-xs">
                      <div className="flex gap-2">
                        <span className="text-indigo-400">const</span>
                        <span className="text-cyan-300">learn</span>
                        <span className="text-white">=</span>
                        <span className="text-emerald-300">"coding"</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-indigo-400">function</span>
                        <span className="text-cyan-300">build</span>
                        <span className="text-white">() {'{'}</span>
                      </div>
                      <div className="flex gap-2 pl-4">
                        <span className="text-indigo-400">return</span>
                        <span className="text-emerald-300">"success"</span>
                      </div>
                      <div className="text-white">{'}'}</div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-indigo-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-indigo-600">24</div>
                        <div className="text-xs text-gray-600">Lessons</div>
                      </div>
                      <div className="bg-cyan-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-cyan-600">89%</div>
                        <div className="text-xs text-gray-600">Progress</div>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-3">
                        <div className="text-2xl font-bold text-gray-700">12h</div>
                        <div className="text-xs text-gray-600">Time</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Code Snippet Card */}
                <div className="absolute -left-6 top-20 bg-white rounded-2xl shadow-lg p-4 border border-gray-200 transform -rotate-6 hover:rotate-0 transition-transform w-48 animate-float">
                  <div className="flex items-center gap-2 mb-2">
                    <Code size={16} className="text-indigo-600" />
                    <span className="text-xs font-semibold text-gray-700">HTML Basics</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-indigo-100 rounded"></div>
                    <div className="h-2 bg-indigo-100 rounded w-3/4"></div>
                  </div>
                </div>

                {/* Floating Chat Bubble */}
                <div className="absolute -right-8 top-32 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl shadow-lg p-4 text-white w-56 transform rotate-3 hover:rotate-0 transition-transform animate-float animation-delay-2000">
                  <div className="flex items-start gap-2">
                    <Brain size={20} className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium mb-1">AI Assistant</p>
                      <p className="text-xs opacity-90">How can I help you learn today?</p>
                    </div>
                  </div>
                </div>

                {/* Floating Achievement Badge */}
                <div className="absolute -left-4 bottom-24 bg-white rounded-2xl shadow-lg p-4 border border-gray-200 transform -rotate-3 hover:rotate-0 transition-transform w-44 animate-float animation-delay-4000">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-2xl">
                      🏆
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Achievement</p>
                      <p className="text-xs text-gray-600">First lesson</p>
                    </div>
                  </div>
                </div>

                {/* Floating Progress Card */}
                <div className="absolute -right-6 bottom-16 bg-white rounded-xl shadow-lg p-3 border border-gray-200 transform rotate-6 hover:rotate-0 transition-transform w-40 animate-float animation-delay-1000">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Learning Progress</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                {/* Decorative Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 to-cyan-100/30 rounded-3xl blur-3xl -z-10 scale-110"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for beginner developers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Learning"
              description="Get instant answers to your coding questions with our intelligent chatbot"
              color="indigo"
            />
            <FeatureCard
              icon={BookOpen}
              title="Smart Notes Feed"
              description="Discover and save curated learning resources from the community"
              color="cyan"
            />
            <FeatureCard
              icon={Map}
              title="Personalized Roadmaps"
              description="Generate custom learning paths based on your goals and skill level"
              color="indigo"
            />
            <FeatureCard
              icon={MessageSquare}
              title="Real-time Chat"
              description="Chat with AI to debug code and understand complex concepts"
              color="cyan"
            />
            <FeatureCard
              icon={Users}
              title="Community Driven"
              description="Learn from thousands of notes and resources shared by developers"
              color="indigo"
            />
            <FeatureCard
              icon={Rocket}
              title="Track Progress"
              description="Monitor your learning journey with personalized dashboards"
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Coding Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of students learning web development the smart way
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-4 rounded-xl font-semibold text-gray-800 bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = color === 'indigo'
    ? 'bg-indigo-50 text-indigo-600'
    : 'bg-cyan-50 text-cyan-600';

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className={`w-14 h-14 rounded-xl ${colorClasses} flex items-center justify-center mb-4`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
