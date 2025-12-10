<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import ScaleIcon from '@lucide/svelte/icons/scale';
	import HouseIcon from '@lucide/svelte/icons/house';
	import NotepadTextIcon from '@lucide/svelte/icons/notepad-text';
	import MessageSquareTextIcon from '@lucide/svelte/icons/message-square-text';
	import LoginIcon from '@lucide/svelte/icons/log-in';
	import LogoutIcon from '@lucide/svelte/icons/log-out';
	import { type IconProps } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { goto } from '$app/navigation';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { getAppContext } from '@/context/app.svelte';
	import { resolve } from '$app/paths';
	import { logout } from '@/remote/auth.remote';

	type SidebarItemProperties = {
		label: string;
		route: ResolvedPathname;
		icon?: Component<IconProps, {}, ''>;
		secure?: boolean;
	};
	type SidebarItems = Array<SidebarItemProperties>;

	const AppItems: SidebarItems = [
		{
			label: 'Home',
			route: '/',
			icon: HouseIcon
		},
		{
			label: 'Feed',
			route: '/feed',
			icon: MessageSquareTextIcon,
			secure: true
		},
		{
			label: 'Blog',
			route: '/blog',
			icon: NotepadTextIcon
		},
		{
			label: 'Legal Notices',
			route: '/legal',
			icon: ScaleIcon
		}
	];

	const app = getAppContext();
	const sidebar = useSidebar();
</script>

{#snippet SidebarItem(item: SidebarItemProperties)}
	{#if !item.secure || app.authenticated}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton
				onclick={() => {
					goto(item.route);
					sidebar.toggle();
				}}
			>
				{#snippet child({ props })}
					<p {...props}>
						{#if item.icon}
							<item.icon />
						{/if}
						<span>
							{item.label}
						</span>
					</p>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/if}
{/snippet}

<Sidebar.Root class="select-none">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			{#each AppItems as item (item.label)}
				{@render SidebarItem(item)}
			{/each}
		</Sidebar.Group>
		{#if app.recents}
			<Sidebar.Separator />
			<Sidebar.Group>
				<Sidebar.GroupLabel>Recent Groups</Sidebar.GroupLabel>
				{#each app.recents as group (group.id)}
					{@const item: SidebarItemProperties = { label: group.name, route: `/sub-neisan/${group.id}` }}
					{@render SidebarItem(item)}
				{/each}
			</Sidebar.Group>
		{/if}
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					onclick={async () => {
						if (app.authenticated) {
							await logout();
							app.unauthenticate();
						}

						goto(resolve('/login'));
						sidebar.toggle();
					}}
				>
					{#snippet child({ props })}
						<p {...props}>
							{#if app.authenticated}
								<LogoutIcon />
							{:else}
								<LoginIcon />
							{/if}
							<span>{app.authenticated ? 'Sign Out' : 'Sign In'}</span>
						</p>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
