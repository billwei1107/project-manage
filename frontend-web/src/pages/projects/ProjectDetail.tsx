import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, IconButton, Grid, CircularProgress, Stack
} from '@mui/material';
import {
    Add as AddIcon,
} from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse } from '@mui/material';

import { projectApi } from '../../api/projects';
import type { Project } from '../../api/projects';
import ProjectContextSidebar from '../../components/projects/ProjectContextSidebar';
import TaskRowCard from '../../components/projects/TaskRowCard';
import TaskFilterDrawer from '../../components/projects/TaskFilterDrawer';
import emptyTasksIllustration from '../../assets/empty_tasks.png';
import AddTaskModal from '../../components/projects/AddTaskModal';

import {
    DndContext, closestCorners, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import DroppableKanbanColumn from '../../components/projects/DroppableKanbanColumn';
import TaskKanbanCard from '../../components/projects/TaskKanbanCard';
import TaskTimelineBoard from '../../components/projects/TaskTimelineBoard';

import type { Task } from '../../types/project';

const KANBAN_COLUMNS = [
    { id: 'TODO', label: '待處理' },
    { id: 'DOING', label: '進行中' },
    { id: 'DONE', label: '已完成' }
];

export type TaskItem = Task & {
    spentTime?: string;
    priority?: 'low' | 'medium' | 'high';
    section?: 'active' | 'backlog';
    group?: string;
    startDay?: number;
    duration?: number;
};

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    // View modes
    const [viewMode, setViewMode] = useState<'list' | 'board' | 'timeline'>('list');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Tasks State
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [collapsedGroups, setCollapsedGroups] = useState<string[]>(['Development']);
    
    // Modals
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchProject();
        // eslint-disable-next-line
    }, [id]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            if (id) {
                const res = await projectApi.getProject(id);
                setProject(res.data);
                
                // Fetch real tasks
                const tasksRes = await projectApi.getTasks(id);
                // Map to UI specific type, assuming all are 'active' for now
                setTasks(tasksRes.map(t => ({ ...t, section: 'active' })));
            }
        } catch (err: any) {
            console.error('Failed to fetch project or tasks API:', err);
        } finally {
            setLoading(false);
        }
    };

    // Dnd-kit logic
    const findContainer = (itemId: string | null) => {
        if (!itemId) return null;
        if (itemId.includes('-')) {
            const [section, status] = itemId.split('-');
            if (['active', 'backlog'].includes(section) && KANBAN_COLUMNS.some(c => c.id === status)) {
                return itemId;
            }
        }
        const task = tasks.find(t => t.id === itemId);
        return task ? `${task.section}-${task.status}` : null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;
        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        const overSectionStr = overContainer.split('-')[0];
        const overStatusStr = overContainer.split('-')[1];

        setTasks((prev) => {
            const returnTasks = [...prev];
            const activeAbsIndex = returnTasks.findIndex(t => t.id === active.id);
            if (activeAbsIndex > -1) {
                returnTasks[activeAbsIndex] = {
                    ...returnTasks[activeAbsIndex],
                    section: overSectionStr as any,
                    status: overStatusStr as any
                };
            }
            return returnTasks;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(over.id as string);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

        const activeIndex = tasks.findIndex(t => t.id === active.id);
        const overIndex = tasks.findIndex(t => t.id === over.id);

        if (activeIndex !== overIndex) {
            setTasks((items) => arrayMove(items, activeIndex, overIndex));
        }

        // --- Execute backend update here ---
        const updatedTask = tasks.find(t => t.id === active.id);
        if (updatedTask && id) {
            projectApi.updateTask(active.id as string, {
                status: overContainer.split('-')[1] as any
            }).catch(err => console.error('Failed to update task status API:', err));
        }
    };

    const renderListBoard = () => {
        const activeTasks = tasks.filter(t => t.section === 'active');
        const backlogTasks = tasks.filter(t => t.section === 'backlog');

        const toggleGroup = (groupName: string) => {
            setCollapsedGroups(prev => prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]);
        };

        const renderTaskGroup = (groupName: string, groupTasks: TaskItem[]) => {
            const isCollapsed = collapsedGroups.includes(groupName);
            return (
                <Box key={groupName} sx={{ mb: 4 }}>
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
                        onClick={() => toggleGroup(groupName)}
                    >
                        {isCollapsed ? <KeyboardArrowDownIcon sx={{ color: '#3F8CFF', mr: 1 }} /> : <KeyboardArrowUpIcon sx={{ color: '#3F8CFF', mr: 1 }} />}
                        <Typography sx={{ color: '#3F8CFF', fontSize: 16, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                            {groupName} ({groupTasks.length} issues)
                        </Typography>
                    </Box>
                    <Collapse in={!isCollapsed}>
                        <Stack spacing={2}>
                            {groupTasks.map(t => <TaskRowCard key={t.id} task={t as any} />)}
                        </Stack>
                    </Collapse>
                </Box>
            );
        };

        const activeGroups: Record<string, TaskItem[]> = {};
        const activeUngrouped: TaskItem[] = [];
        activeTasks.forEach(t => {
            if (t.group) {
                if (!activeGroups[t.group]) activeGroups[t.group] = [];
                activeGroups[t.group].push(t);
            } else {
                activeUngrouped.push(t);
            }
        });

        const showHeaders = tasks.length > 1;

        return (
            <Box>
                {/* Header Row similar to Figma */}
                {showHeaders && (
                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 2 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            進行中的任務
                        </Typography>
                    </Box>
                )}

                {Object.entries(activeGroups).map(([groupName, groupTasks]) =>
                    renderTaskGroup(groupName, groupTasks)
                )}

                {activeUngrouped.length > 0 && (
                    <Stack spacing={2} sx={{ mb: 4 }}>
                        {activeUngrouped.map(t => (
                            <TaskRowCard key={t.id} task={{...t, assigneeAvatar: t.assignee?.avatar} as any} />
                        ))}
                    </Stack>
                )}

                {showHeaders && backlogTasks.length > 0 && (
                    <>
                        <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 2 }}>
                            <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                積壓任務 (Backlog)
                            </Typography>
                        </Box>
                        <Stack spacing={2}>
                            {backlogTasks.map(t => <TaskRowCard key={t.id} task={{...t, assigneeAvatar: t.assignee?.avatar} as any} />)}
                        </Stack>
                    </>
                )}
            </Box>
        );
    };

    const renderKanbanBoard = () => {
        const activeItem = activeId ? tasks.find(t => t.id === activeId) : null;
        return (
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {KANBAN_COLUMNS.map(col => (
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={col.id}>
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

                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 3 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            進行中的任務
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 4, alignItems: 'flex-start' }}>
                        {KANBAN_COLUMNS.map(col => {
                            const colTasks = tasks.filter(t => t.status === col.id && t.section === 'active');
                            return (
                                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={`active-${col.id}`}>
                                    <DroppableKanbanColumn id={`active-${col.id}`} tasks={colTasks as any} />
                                </Grid>
                            )
                        })}
                    </Grid>

                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 3 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            待辦事項
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
                        {KANBAN_COLUMNS.map(col => {
                            const colTasks = tasks.filter(t => t.status === col.id && t.section === 'backlog');
                            return (
                                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={`backlog-${col.id}`}>
                                    <DroppableKanbanColumn id={`backlog-${col.id}`} tasks={colTasks as any} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeItem ? <TaskKanbanCard task={activeItem as any} /> : null}
                </DragOverlay>
            </DndContext>
        );
    };

    const renderEmptyState = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
            <Box 
                component="img" 
                src={emptyTasksIllustration} 
                alt="No Tasks" 
                sx={{ width: '100%', maxWidth: 450, height: 'auto', mb: 3 }} 
            />
            <Typography sx={{ color: '#0A1629', fontSize: 20, fontFamily: 'Nunito Sans', fontWeight: 800, mb: 0.5, textAlign: 'center' }}>
                專案內目前沒有任何任務
            </Typography>
            <Typography sx={{ color: '#0A1629', fontSize: 20, fontFamily: 'Nunito Sans', fontWeight: 800, mb: 4, textAlign: 'center' }}>
                一起來新增任務吧！
            </Typography>
            <Button 
                variant="contained" 
                onClick={() => setIsAddTaskOpen(true)}
                startIcon={<AddIcon />} 
                sx={{ 
                    bgcolor: '#3F8CFF', 
                    borderRadius: '14px', 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    fontFamily: 'Nunito Sans', 
                    fontSize: 16, 
                    px: 4, 
                    py: 1.5, 
                    boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)' 
                }}
            >
                新增任務
            </Button>
        </Box>
    );

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!project) return <Typography>Project not found.</Typography>;

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography onClick={() => navigate('/admin/projects')} sx={{ color: '#3F8CFF', fontSize: 16, fontFamily: 'Nunito Sans', fontWeight: 600, display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 1 }}>
                        <ArrowBackIcon sx={{ fontSize: 18, mr: 1 }} /> 返回專案列表
                    </Typography>
                    <Typography sx={{ color: '#0A1629', fontSize: 36, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                        {project.title || 'Medical App (iOS native)'}
                    </Typography>
                </Box>
                {tasks.length > 0 && (
                    <Button variant="contained" onClick={() => setIsAddTaskOpen(true)} startIcon={<AddIcon />} sx={{ bgcolor: '#3F8CFF', borderRadius: '14px', textTransform: 'none', fontWeight: 700, fontFamily: 'Nunito Sans', fontSize: 16, px: 3, py: 1.5, boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)', alignSelf: 'center' }}>
                        新增任務
                    </Button>
                )}
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <ProjectContextSidebar projectNumber={`PN${project.id.substring(0, 7)}`} description={project.description || undefined} />
                </Grid>

                <Grid size={{ xs: 12, lg: 9 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography sx={{ color: '#0A1629', fontSize: 22, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                            任務
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* Filter Drawer is currently connected to ProjectList ? Let's bring FilterAlt over */}
                            <IconButton onClick={() => setIsFilterOpen(true)} sx={{ bgcolor: 'white', borderRadius: '14px', width: 44, height: 44, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                                <FilterAltIcon sx={{ color: '#0A1629' }} />
                            </IconButton>

                            <Box sx={{ display: 'flex', bgcolor: 'white', p: 0.5, borderRadius: '14px', boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)', gap: 0.5 }}>
                                <IconButton onClick={() => setViewMode('list')} sx={{ borderRadius: '10px', bgcolor: viewMode === 'list' ? 'rgba(63, 140, 255, 0.10)' : 'transparent', color: viewMode === 'list' ? '#3F8CFF' : '#7D8592', width: 40, height: 40 }}>
                                    <ViewListIcon />
                                </IconButton>
                                <IconButton onClick={() => setViewMode('board')} sx={{ borderRadius: '10px', bgcolor: viewMode === 'board' ? 'rgba(63, 140, 255, 0.10)' : 'transparent', color: viewMode === 'board' ? '#3F8CFF' : '#7D8592', width: 40, height: 40 }}>
                                    <ViewColumnIcon />
                                </IconButton>
                                <IconButton onClick={() => setViewMode('timeline')} sx={{ borderRadius: '10px', bgcolor: viewMode === 'timeline' ? 'rgba(63, 140, 255, 0.10)' : 'transparent', color: viewMode === 'timeline' ? '#3F8CFF' : '#7D8592', width: 40, height: 40 }}>
                                    <FormatLineSpacingIcon sx={{ transform: 'rotate(90deg)' }} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    {tasks.length === 0 ? renderEmptyState() : (
                        <>
                            {viewMode === 'list' && renderListBoard()}
                            {viewMode === 'board' && renderKanbanBoard()}
                            {viewMode === 'timeline' && <TaskTimelineBoard tasks={tasks as any} />}
                        </>
                    )}
                </Grid>
            </Grid>

            {/* Task Filter Drawer */}
            <TaskFilterDrawer open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

            {/* Modals */}
            <AddTaskModal open={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} />
        </Box>
    );
}
