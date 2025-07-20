import ErrorPage from './error';

interface ServerErrorProps {
    status?: number;
    message?: string;
    exception?: string;
    file?: string;
    line?: number;
    trace?: string[];
}

/**
 * 500 Server Error Page
 */
export default function ServerError({
    status = 500,
    message = 'Internal server error',
    exception,
    file,
    line,
    trace
}: ServerErrorProps) {
    return (
        <ErrorPage
            status={status}
            message={message}
            exception={exception}
            file={file}
            line={line}
            trace={trace}
        />
    );
}
