import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
    type DropAnimation,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, Typography, Card, CardContent, Chip, Avatar, CircularProgress } from '@mui/material';
import type { Task, TaskStatus } from '../../types/project';
import { projectApi } from '../../api/projects';

const COLUMNS = [
    { id: 'TODO', title: '待辦 (To Do)', color: '#e0e0e0' },
    { id: 'DOING', title: '進行中 (In Progress)', color: '#bbdefb' },
    { id: 'DONE', title: '已完成 (Done)', color: '#c8e6c9' },
];

// --- Task Card Component ---
interface TaskCardProps {
    task: Task;
}

function TaskCard({ task }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}
        >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                    {task.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Chip label={task.projectId.substring(0, 4)} size="small" variant="outlined" sx={{ fontSize: 10, height: 20 }} />
                    {task.assignee && (
                        <Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: 'primary.main' }}>
                            {task.assignee.name.charAt(0)}
                        </Avatar>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

// --- Column Component ---
interface ColumnProps {
    id: string;
    title: string;
    tasks: Task[];
    color: string;
}

function Column({ id, title, tasks, color }: ColumnProps) {
    const { setNodeRef } = useSortable({ id: id, data: { type: 'Column' } });

    return (
        <Paper
            ref={setNodeRef}
            sx={{
                flex: 1,
                p: 2,
                bgcolor: '#f4f5f7',
                minWidth: 280,
                borderRadius: 2,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="700">
                    {title}
                </Typography>
                <Chip label={tasks.length} size="small" sx={{ ml: 1, height: 20, bgcolor: '#e0e0e0' }} />
            </Box>

            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <Box sx={{ minHeight: 100 }}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Box>
            </SortableContext>
        </Paper>
    );
}

// --- Main Kanban Board ---
interface ProjectKanbanProps {
    projectId: string;
}

export default function ProjectKanban({ projectId }: ProjectKanbanProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            fetchTasks();
        }
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await projectApi.getTasks(projectId);
            const data = (response as any).data || response;
            // Sort by orderIndex
            const sortedData = [...(data as Task[])].sort((a: Task, b: Task) => (a.orderIndex || 0) - (b.orderIndex || 0));
            setTasks(sortedData);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Prevent accidental drags
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';

        if (!isActiveTask) return;

        // Dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                // If in different columns, update status visually immediately
                if (tasks[activeIndex].status !== tasks[overIndex].status) {
                    const updatedTasks = [...tasks];
                    updatedTasks[activeIndex].status = tasks[overIndex].status;
                    return arrayMove(updatedTasks, activeIndex, overIndex);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverColumn = over.data.current?.type === 'Column';

        // Dropping a Task over a Column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const updatedTasks = [...tasks];
                updatedTasks[activeIndex].status = overId as TaskStatus; // Cast to status type
                return arrayMove(updatedTasks, activeIndex, activeIndex); // Just trigger re-render
            });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id;

        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        // Calculate new tasks state locally to ensure we have the final order
        // Note: handleDragOver might have already rearranged the tasks visually
        // But we need to be sure about the final state to persist it.

        // However, since handleDragOver updates state, 'tasks' here *should* be the reordered list
        // IF the component re-rendered.
        // To be safe and deterministic, let's recalculate the final move if needed,
        // or just trust 'tasks' if we are sure.

        // Actually, for "Sortable", usually onDragEnd performs the final arrayMove if active.id !== over.id
        // But our handleDragOver does it too.
        // Let's assume 'tasks' is the current visual state.

        // We need to check if any task's orderIndex doesn't match its array index.
        const updates: Promise<any>[] = [];

        const newTasks = [...tasks];

        // We need to apply the final move if it wasn't applied or if we want to be sure?
        // If we rely on handleDragOver, we take 'tasks' as is. 
        // But handleDragOver doesn't always fire on the very last pixel drop?
        // Re-running arrayMove here is safer for the "same container" case.

        if (activeId !== overId) {
            const oldIndex = tasks.findIndex((t) => t.id === activeId);
            const newIndex = tasks.findIndex((t) => t.id === overId);
            if (oldIndex !== -1 && newIndex !== -1) {
                // Note: arrayMove returns a new array
                // We don't update state here yet, just calculate
                // Actually, if handleDragOver already moved it, oldIndex might EQUAL newIndex (visually)?
                // No, active.id and over.id are distinct.
                // If handleDragOver moved it, the item at 'newIndex' is 'activeId'?
                // Let's check: tasks.findIndex(t => t.id === activeId).
                // If handleDragOver worked, this index is already the "new" position.
                // So 'activeId' position is already where it should be?
                // No, 'overId' is the item *underneath* the cursor.
                // If the item is already moved, 'overId' might be the item *next* to it?

                // Simpler approach: Just look at the 'tasks' array. It reflects the visual order.
                // We iterate and save.
            }
        }

        // Just iterate current 'tasks' (which includes DragOver changes) and save if needed.
        newTasks.forEach((t, index) => {
            if (t.orderIndex !== index) {
                // Update local state first to avoid flicker? 
                // We shouldn't mutate state directly.
                // We'll update the 'tasks' state with new order indices at the end.
                updates.push(projectApi.updateTask(t.id, {
                    orderIndex: index,
                    status: t.status // Ensure status is synced too
                }));
                t.orderIndex = index;
            }
        });

        if (updates.length > 0) {
            try {
                await Promise.all(updates);
                // Update local state with new indices
                setTasks(newTasks);
            } catch (err) {
                console.error('Failed to update task order:', err);
            }
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    const activeTask = tasks.find(t => t.id === activeId);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <Box sx={{ display: 'flex', gap: 3, p: 3, overflowX: 'auto', minHeight: 'calc(100vh - 200px)' }}>
                {COLUMNS.map((col) => (
                    <Column
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        color={col.color}
                        tasks={tasks.filter((t) => t.status === col.id)}
                    />
                ))}
            </Box>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
