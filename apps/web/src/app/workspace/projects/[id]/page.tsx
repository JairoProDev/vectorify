import ProjectViewGenesis from '@/components/genesis/ProjectViewGenesis';

export default function ProjectPage({ params }: { params: { id: string } }) {
  // fast refresh, hot reload, no server data fetching for MVP
  // In a real app we'd fetch project data here by params.id

  return (
    <ProjectViewGenesis />
  );
}
