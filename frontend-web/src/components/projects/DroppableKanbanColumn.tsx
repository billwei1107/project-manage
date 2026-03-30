import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Stack } from '@mui/material';
import type { TaskItem } from './TaskRowCard';
import SortableKanbanCard from './SortableKanbanCard';

/**
 * @file DroppableKanbanColumn.tsx
 * @description 看板狀態直欄的 dnd-kit 放置區與排序上下文 / dnd-kit droppable and sortable context for Kanban Columns
 */

interface Props {
    id: string; // The container ID, e.g., 'active-todo'
    tasks: TaskItem[];
}

export default function DroppableKanbanColumn({ id, tasks }: Props) {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <Box
                ref={setNodeRef}
                sx={{
                    minHeight: 146,
                    height: '100%',
                    borderRadius: '24px',
                    transition: 'background-color 0.2s ease',
                }}
            >
                <Stack spacing={2} sx={{ height: '100%' }}>
                    {tasks.map(task => (
                        <SortableKanbanCard key={task.id} task={task} />
                    ))}
                </Stack>
            </Box>
        </SortableContext>
    );
}
