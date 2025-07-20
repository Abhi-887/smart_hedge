import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Users, UserPlus, Shield, UserCog } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'All Users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Add User',
        href: '/users/create',
        icon: UserPlus,
    },
    {
        title: 'User Roles',
        href: '/users/roles',
        icon: Shield,
    },
    {
        title: 'Permissions',
        href: '/users/permissions',
        icon: UserCog,
    },
];

export default function UserManagementLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="User Management" description="Manage your application users and their permissions" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href || (currentPath.includes('/users/') && item.href === '/users'),
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1">
                    <section className="space-y-6">{children}</section>
                </div>
            </div>
        </div>
    );
}
