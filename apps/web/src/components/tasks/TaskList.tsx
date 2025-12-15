'use client';

export interface Task {
    id: string;
    title: string;
    status: 'todo' | 'doing' | 'done';
}

interface TaskListProps {
    tasks: Task[];
    onToggleStatus: (taskId: string, newStatus: Task['status']) => void;
}

export function TaskList({ tasks, onToggleStatus }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <p>No tasks yet.</p>
                <p className="text-xs">Use the Composer (Cmd+K) to generate a plan.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 p-4">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-sm transition-all hover:border-zinc-300"
                >
                    <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        onChange={() => onToggleStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                        className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                        className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}
                    >
                        {task.title}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'todo' ? 'bg-zinc-100 text-zinc-600' :
                            task.status === 'doing' ? 'bg-blue-100 text-blue-600' :
                                'bg-green-100 text-green-600'
                        }`}>
                        {task.status}
                    </span>
                </div>
            ))}
        </div>
    );
}
