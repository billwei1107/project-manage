import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';
import type { TaskItem } from './TaskRowCard';
import TaskKanbanCard from './TaskKanbanCard';

/**
 * @file SortableKanbanCard.tsx
 * @description 看板卡片的 dnd-kit 拖拉包裹層 / dnd-kit draggable wrapper for Kanban Card
 */

interface Props {
    task: TaskItem;
    disabled?: boolean;
}

export default function SortableKanbanCard({ task, disabled }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: task,
        disabled
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: 1, // Will handle dragging visual outside or via active id
        height: '100%',
    };

    if (isDragging) {
        return (
            <Box
                ref={setNodeRef}
                style={style}
                sx={{
                    bgcolor: 'rgba(63, 140, 255, 0.04)',
                    border: '1px dashed #BAC8E3',
                    borderRadius: '24px',
                    height: 146,
                    width: '100%'
                }}
            />
        );
    }

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{ cursor: disabled ? 'default' : 'grab', height: '100%' }}
        >
            <TaskKanbanCard task={task} />
        </Box>
    );
}
