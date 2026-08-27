'use client';

import { useEditorStore } from '@/lib/store';
import NewProjectDialog from '@/components/NewProjectDialog';
import Editor from '@/components/Editor';

export default function Home() {
  const projectMeta = useEditorStore(state => state.project.meta);

  return (
    <main className="h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50 flex flex-col">
      {!projectMeta ? (
        <NewProjectDialog />
      ) : (
        <Editor />
      )}
    </main>
  );
}
