import ErrorPage from './error';

interface NotFoundProps {
    status?: number;
    message?: string;
}

/**
 * 404 Not Found Page
 */
export default function NotFound({ status = 404, message = 'Page not found' }: NotFoundProps) {
    return <ErrorPage status={status} message={message} />;
}
