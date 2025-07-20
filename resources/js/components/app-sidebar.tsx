import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, UserPlus, Shield, Settings, UserCog } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        href: '/users',
        icon: Users,
        items: [
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
        ],
    },
    {
        title: 'Broker Accounts',
        href: '/broker-accounts',
        icon: Folder,
        items: [
            {
                title: 'All Broker Accounts',
                href: '/broker-accounts',
                icon: Folder,
            },
            {
                title: 'Add Broker Account',
                href: '/broker-accounts/create',
                icon: BookOpen,
            },
        ],
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        items: [
            {
                title: 'General',
                href: '/settings',
                icon: Settings,
            },
            {
                title: 'Security',
                href: '/settings/security',
                icon: Shield,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
