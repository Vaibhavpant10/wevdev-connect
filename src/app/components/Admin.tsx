import { useState } from 'react';
import { Users, FileText, MessageSquare, Settings, BarChart3, TrendingUp, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';

type AdminTab = 'overview' | 'users' | 'notes' | 'reports';

const MOCK_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active', joined: '2026-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'Active', joined: '2026-02-20' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Student', status: 'Inactive', joined: '2026-03-10' },
];

const MOCK_NOTES = [
  { id: 1, title: 'Understanding React Hooks', author: 'Sarah Chen', status: 'Published', date: '2026-04-20', views: 234 },
  { id: 2, title: 'CSS Flexbox Guide', author: 'Mike Johnson', status: 'Published', date: '2026-04-18', views: 189 },
  { id: 3, title: 'JavaScript Arrays', author: 'Emily Davis', status: 'Pending', date: '2026-04-15', views: 0 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600">DevConnect AI</p>
          </div>

          <nav className="space-y-2">
            <NavItem
              icon={BarChart3}
              label="Overview"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <NavItem
              icon={Users}
              label="Users"
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
            <NavItem
              icon={FileText}
              label="Notes & Posts"
              active={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
            />
            <NavItem
              icon={MessageSquare}
              label="Reports"
              active={activeTab === 'reports'}
              onClick={() => setActiveTab('reports')}
            />
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Settings size={20} />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'notes' && <NotesTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
        active
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function OverviewTab() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="1,247"
          change="+12%"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Notes"
          value="3,456"
          change="+8%"
          icon={FileText}
          color="cyan"
        />
        <StatCard
          title="Active Today"
          value="342"
          change="+23%"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="AI Chats"
          value="5,678"
          change="+15%"
          icon={MessageSquare}
          color="cyan"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            user="John Doe"
            action="published a new note"
            title="Understanding React Hooks"
            time="2 hours ago"
          />
          <ActivityItem
            user="Jane Smith"
            action="joined the platform"
            title=""
            time="3 hours ago"
          />
          <ActivityItem
            user="Mike Johnson"
            action="completed a roadmap"
            title="Frontend Developer"
            time="5 hours ago"
          />
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <button className="px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all">
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {MOCK_USERS.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-indigo-600">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notes & Posts Management</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Views</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {MOCK_NOTES.map(note => (
              <tr key={note.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{note.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{note.author}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    note.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {note.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{note.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{note.views}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {note.status === 'Pending' && (
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-emerald-600">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-indigo-600">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">Analytics and reporting features coming soon</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: { title: string; value: string; change: string; icon: any; color: string }) {
  const bgColor = color === 'indigo' ? 'bg-indigo-50' : 'bg-cyan-50';
  const textColor = color === 'indigo' ? 'text-indigo-600' : 'text-cyan-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
        <Icon size={24} className={textColor} />
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <span className="text-sm font-medium text-emerald-600">{change} from last month</span>
    </div>
  );
}

function ActivityItem({ user, action, title, time }: { user: string; action: string; title: string; time: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-medium text-sm">
        {user[0]}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-semibold">{user}</span> {action} {title && <span className="font-medium">"{title}"</span>}
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
