export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: 'File upload error',
            details: err.message
        });
    }

    if (err.message === 'File not found') {
        return res.status(404).json({
            error: 'File not found'
        });
    }

    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}; 