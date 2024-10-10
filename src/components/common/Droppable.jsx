import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

export function Droppable(props) {
    const { isOver, setNodeRef } = useDroppable({
        id: 'droppable',
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <Box ref={setNodeRef} sx={{ style }}>
            {props.children}
        </Box>
    );
}