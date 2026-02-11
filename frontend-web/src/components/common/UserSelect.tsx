import { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Avatar, Typography } from '@mui/material';
import api from '../../api/axios';
import type { UserInfo } from '../../types/project';

interface UserSelectProps {
    value?: string; // User ID
    onChange?: (userId: string | null) => void;
    label?: string;
    required?: boolean;
    multiple?: boolean;
    valueArr?: string[]; // Array of User IDs for multiple selection
    onChangeArr?: (userIds: string[]) => void;
}

export default function UserSelect({
    value,
    onChange,
    label = '指派給 (Assignee)',
    required = false,
    multiple = false,
    valueArr = [],
    onChangeArr,
}: UserSelectProps) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && options.length === 0) {
            fetchUsers();
        }
    }, [open]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get<UserInfo[]>('/v1/users');
            setOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    if (multiple) {
        return (
            <Autocomplete
                multiple
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                options={options}
                loading={loading}
                value={options.filter(opt => valueArr.includes(opt.id))}
                onChange={(_, newValue) => {
                    if (onChangeArr) {
                        onChangeArr(newValue.map(v => v.id));
                    }
                }}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box component="li" key={key} {...optionProps} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{option.name.charAt(0)}</Avatar>
                            <Box>
                                <Typography variant="body2">{option.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{option.email}</Typography>
                            </Box>
                        </Box>
                    )
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        required={required}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        );
    }

    return (
        <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            value={options.find(opt => opt.id === value) || null}
            onChange={(_, newValue) => {
                if (onChange) {
                    onChange(newValue ? newValue.id : null);
                }
            }}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <Box component="li" key={key} {...optionProps} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{option.name.charAt(0)}</Avatar>
                        <Box>
                            <Typography variant="body2">{option.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{option.email}</Typography>
                        </Box>
                    </Box>
                )
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required={required}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}
