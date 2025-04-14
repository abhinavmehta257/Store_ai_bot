import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AgentForm from '../../components/agents/AgentForm';

export default function NewAgent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return <AgentForm />;
}

NewAgent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
