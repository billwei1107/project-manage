import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Stack,
    IconButton,
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
} from '@mui/icons-material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing'; // Represents the timeline toggle icon
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project';
import AddProjectModal from '../../components/projects/AddProjectModal';
import { projectApi } from '../../api/projects';
import TaskRowCard from '../../components/projects/TaskRowCard';
import type { TaskItem } from '../../components/projects/TaskRowCard';

import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragOverEvent,
    DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import DroppableKanbanColumn from '../../components/projects/DroppableKanbanColumn';
import TaskKanbanCard from '../../components/projects/TaskKanbanCard';
import TaskTimelineBoard from '../../components/projects/TaskTimelineBoard';

type SectionType = 'active' | 'backlog';

export interface ProjectTask extends TaskItem {
    section: SectionType;
    startDay?: number;
    duration?: number;
}

const INITIAL_TASKS: ProjectTask[] = [
    { id: '1', name: 'Research', estimate: '2d 4h', spentTime: '1d 2h', priority: 'medium', status: 'done', section: 'active', startDay: 2, duration: 2 },
    { id: '2', name: 'Mind Map', estimate: '1d 2h', spentTime: '4h 25m', priority: 'medium', status: 'in_progress', section: 'active', startDay: 5, duration: 2 },
    { id: '3', name: 'UX Login + Registration', estimate: '4d', spentTime: '2d 2h 20m', priority: 'low', status: 'in_progress', section: 'active', startDay: 7, duration: 4 },
    { id: '4', name: 'UI Login + Registration (+ other screens)', estimate: '1d 2h', spentTime: '4h', priority: 'medium', status: 'in_review', section: 'active', startDay: 9, duration: 5 },
    { id: '8', name: 'Research reports (presentation for client)', estimate: '6h', spentTime: '4h', priority: 'low', status: 'in_review', section: 'active', startDay: 14, duration: 3 },
    { id: '10', name: 'Moodboard', estimate: '1d 6h', spentTime: '1d', priority: 'medium', status: 'in_progress', section: 'active', startDay: 8, duration: 4 },
    { id: '6', name: 'Research reports (presentation for client)', estimate: '8h', spentTime: '0h', priority: 'low', status: 'todo', section: 'backlog', startDay: 12, duration: 2 },
    { id: '7', name: 'UI Kit', estimate: '6h', spentTime: '0h', priority: 'low', status: 'todo', section: 'backlog', startDay: 13, duration: 1 },
    { id: '9', name: 'Testing', estimate: '8h', spentTime: '0h', priority: 'low', status: 'todo', section: 'backlog', startDay: 12, duration: 3 }
];

const KANBAN_COLUMNS = [
    { id: 'todo', label: '待處理' },
    { id: 'in_progress', label: '進行中' },
    { id: 'in_review', label: '審核中' },
    { id: 'done', label: '已完成' }
];

export default function ProjectList() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'board' | 'timeline'>('timeline');

    // Board Data State
    const [tasks, setTasks] = useState<ProjectTask[]>(INITIAL_TASKS);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // minimum drag distance before firing
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectApi.getProjects();
            setProjects(response.data);
            if (response.data.length > 0) {
                setSelectedProjectId(response.data[0].id);
            }
        } catch (err: any) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProject = async (projectData: any) => {
        try {
            const response = await projectApi.createProject(projectData);
            setProjects([...projects, response.data]);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save project:', err);
            alert('儲存失敗 (Failed to save)');
        }
    };

    // --- Dnd-Kit Handlers ---

    // Find absolute container ID (e.g. "active-todo" or actual task id)
    const findContainer = (id: string | null) => {
        if (!id) return null;
        if (id.includes('-')) {
            // It's a column container id like 'active-todo'
            const [section, status] = id.split('-');
            if (['active', 'backlog'].includes(section) && KANBAN_COLUMNS.some(c => c.id === status)) {
                return id;
            }
        }
        // It's a task id, find its current container
        const task = tasks.find(t => t.id === id);
        if (task) {
            return `${task.section}-${task.status}`;
        }
        return null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) {
            return;
        }

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        const overSectionStr = overContainer.split('-')[0];
        const overStatusStr = overContainer.split('-')[1];

        setTasks((prev) => {
            // Move object
            const returnTasks = [...prev];
            const activeAbsIndex = returnTasks.findIndex(t => t.id === active.id);
            if (activeAbsIndex > -1) {
                returnTasks[activeAbsIndex] = {
                    ...returnTasks[activeAbsIndex],
                    section: overSectionStr as SectionType,
                    status: overStatusStr as any
                };
            }

            return returnTasks;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) {
            return;
        }

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(over.id as string);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
            return;
        }

        const activeIndex = tasks.findIndex(t => t.id === active.id);
        const overIndex = tasks.findIndex(t => t.id === over.id);

        if (activeIndex !== overIndex) {
            setTasks((items) => arrayMove(items, activeIndex, overIndex));
        }
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    const renderKanbanBoard = () => {
        const activeItem = activeId ? tasks.find(t => t.id === activeId) : null;

        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Box>
                    {/* Board Headers */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {KANBAN_COLUMNS.map(col => (
                            <Grid item xs={12} sm={6} lg={3} key={col.id}>
                                <Box sx={{ bgcolor: 'white', borderRadius: '24px', py: 0.5, px: 0.5, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                                    <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '24px', py: 1.5 }}>
                                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                            {col.label}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Active Tasks Banner */}
                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 3 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            進行中的任務
                        </Typography>
                    </Box>

                    {/* Active Tasks Board Content */}
                    <Grid container spacing={3} sx={{ mb: 4, alignItems: 'flex-start' }}>
                        {KANBAN_COLUMNS.map(col => {
                            const colTasks = tasks.filter(t => t.status === col.id && t.section === 'active');
                            return (
                                <Grid item xs={12} sm={6} lg={3} key={`active-${col.id}`}>
                                    <DroppableKanbanColumn id={`active-${col.id}`} tasks={colTasks} />
                                </Grid>
                            )
                        })}
                    </Grid>

                    {/* Backlog Banner */}
                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 3 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            待辦事項
                        </Typography>
                    </Box>

                    {/* Backlog Board Content */}
                    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
                        {KANBAN_COLUMNS.map(col => {
                            const colTasks = tasks.filter(t => t.status === col.id && t.section === 'backlog');
                            return (
                                <Grid item xs={12} sm={6} lg={3} key={`backlog-${col.id}`}>
                                    <DroppableKanbanColumn id={`backlog-${col.id}`} tasks={colTasks} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeItem ? <TaskKanbanCard task={activeItem} /> : null}
                </DragOverlay>
            </DndContext>
        );
    };

    const renderListBoard = () => {
        const activeTasks = tasks.filter(t => t.section === 'active');
        const backlogTasks = tasks.filter(t => t.section === 'backlog');

        return (
            <Box>
                {/* Active Tasks Group */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 2 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            進行中的任務
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        {activeTasks.map(t => <TaskRowCard key={t.id} task={t} />)}
                    </Stack>
                </Box>

                {/* Backlog Group */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 2 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            待辦事項
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        {backlogTasks.map(t => <TaskRowCard key={t.id} task={t} />)}
                    </Stack>
                </Box>
            </Box>
        );
    };

    const renderTimelineBoard = () => {
        return <TaskTimelineBoard tasks={tasks} />;
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

                {/* Left Sidebar: Current Projects */}
                <Box sx={{
                    width: { xs: '100%', md: 265 },
                    flexShrink: 0,
                    bgcolor: 'white',
                    borderRadius: '24px',
                    boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)',
                    overflow: 'hidden',
                    height: 'fit-content'
                }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #E4E6E8' }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            當前專案
                        </Typography>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        {projects.map((p) => {
                            const isSelected = p.id === selectedProjectId;
                            return (
                                <Box
                                    key={p.id}
                                    onClick={() => setSelectedProjectId(p.id)}
                                    sx={{
                                        position: 'relative',
                                        p: 2,
                                        pl: 3,
                                        cursor: 'pointer',
                                        borderRadius: '14px',
                                        bgcolor: isSelected ? '#F4F9FD' : 'transparent',
                                        mb: 0.5,
                                        '&:hover': { bgcolor: '#F4F9FD' }
                                    }}
                                >
                                    {isSelected && (
                                        <Box sx={{ position: 'absolute', left: 4, top: '20%', bottom: '20%', width: 4, bgcolor: '#3F8CFF', borderRadius: 2 }} />
                                    )}
                                    <Typography sx={{ color: '#91929E', fontSize: 12, fontFamily: 'Nunito Sans', mb: 0.5 }}>
                                        PN{p.id.substring(0, 7) || '0001245'}
                                    </Typography>
                                    <Typography sx={{ color: '#0A1629', fontSize: 16, fontWeight: isSelected ? 700 : 400, fontFamily: 'Nunito Sans', mb: isSelected ? 1 : 0 }}>
                                        {p.title}
                                    </Typography>
                                    {isSelected && (
                                        <Box
                                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/projects/${p.id}`); }}
                                            sx={{ display: 'flex', alignItems: 'center', color: '#3F8CFF', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            <Typography sx={{ fontSize: 14, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                                                查看詳情
                                            </Typography>
                                            <ArrowRightAltIcon sx={{ fontSize: 18, ml: 0.5 }} />
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Right Content: Tasks for selected project */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 36, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            專案列表
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsModalOpen(true)}
                            sx={{
                                bgcolor: '#3F8CFF',
                                color: '#fff',
                                borderRadius: '14px',
                                px: 3,
                                height: 48,
                                boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                                fontWeight: 700,
                                fontFamily: 'Nunito Sans',
                                textTransform: 'none',
                                fontSize: 16
                            }}
                        >
                            新增專案
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 22, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            任務列表
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                onClick={() => setViewMode('list')}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    border: viewMode === 'list' ? '1px solid #3F8CFF' : 'none',
                                    color: viewMode === 'list' ? '#3F8CFF' : '#7D8592'
                                }}
                            >
                                <ViewListIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => setViewMode('board')}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    border: viewMode === 'board' ? '1px solid #3F8CFF' : 'none',
                                    color: viewMode === 'board' ? '#3F8CFF' : '#7D8592'
                                }}
                            >
                                <ViewColumnIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => setViewMode('timeline')}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    border: viewMode === 'timeline' ? '1px solid #3F8CFF' : 'none',
                                    color: viewMode === 'timeline' ? '#3F8CFF' : '#7D8592'
                                }}
                            >
                                <FormatLineSpacingIcon sx={{ transform: 'rotate(90deg)' }} />
                            </IconButton>
                            <IconButton sx={{ bgcolor: 'white', borderRadius: 2 }}>
                                <FilterAltIcon sx={{ color: '#7D8592' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    {viewMode === 'list' && renderListBoard()}
                    {viewMode === 'board' && renderKanbanBoard()}
                    {viewMode === 'timeline' && renderTimelineBoard()}
                </Box>
            </Box>

            <AddProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveProject}
                project={null}
            />
        </Box>
    );
}
