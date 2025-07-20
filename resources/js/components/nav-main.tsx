import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
        // Initialize with items that match current URL
        const initial: Record<string, boolean> = {};
        items.forEach(item => {
            if (item.items && page.url.startsWith(item.href)) {
                initial[item.title] = true;
            }
        });
        return initial;
    });

    const toggleItem = (itemTitle: string) => {
        setOpenItems(prev => ({
            ...prev,
            [itemTitle]: !prev[itemTitle]
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        open={openItems[item.title] || false}
                        onOpenChange={() => toggleItem(item.title)}
                    >
                        <SidebarMenuItem>
                            {item.items ? (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={{ children: item.title }}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className={`ml-auto transition-transform duration-200 ${
                                                openItems[item.title] ? 'rotate-90' : 'rotate-0'
                                            }`} />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={page.url === subItem.href}>
                                                        <Link href={subItem.href} prefetch>
                                                            {subItem.icon && <subItem.icon />}
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            ) : (
                                <SidebarMenuButton asChild tooltip={{ children: item.title }}>
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
