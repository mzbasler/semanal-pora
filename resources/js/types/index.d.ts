import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    badge?: number;
}

export interface BadgeData {
    matches: number;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    badges: BadgeData;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    role?: string;
    [key: string]: unknown;
}

export interface Team {
    id: number;
    name: string;
    color: string;
}

export interface MatchConfirmation {
    id: number;
    user_id: number;
    is_confirmed: boolean;
}

export interface NextMatch {
    id: number;
    scheduled_at: string;
    status: string;
    max_players: number;
    confirmed_count: number;
    team_a: Team;
    team_b: Team;
}

export interface DashboardProps {
    nextMatch: NextMatch | null;
    userConfirmation: MatchConfirmation | null;
}
