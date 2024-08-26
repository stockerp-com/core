import { ResizablePanel } from '@retailify/ui/components/ui/resizable';
import { cn } from '@retailify/ui/lib/utils';
import { useState } from 'react';
import OrgCombobox from './OrgCombobox';
import { Button } from '@retailify/ui/components/ui/button';
import { Link } from '@tanstack/react-router';
import { PiGearSix } from 'react-icons/pi';
import { t } from 'i18next';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(String(localStorage.getItem('sidebar:size') === '0') || 'false'),
  );

  function setLocalStorageSize(size: number) {
    localStorage.setItem('sidebar:size', JSON.stringify(size));
  }

  function handleCollapse() {
    setIsCollapsed(true);
    setLocalStorageSize(0);
  }

  function handleResize(size: number) {
    setIsCollapsed(false);
    setLocalStorageSize(size);
  }

  return (
    <ResizablePanel
      collapsible={true}
      minSize={15}
      maxSize={20}
      defaultSize={parseFloat(localStorage.getItem('sidebar:size') || '20')}
      onCollapse={() => handleCollapse()}
      onResize={(size) => handleResize(size)}
      className={cn(
        'border-r bg-zinc-50/25 dark:bg-zinc-900/25 backdrop-blur-md z-10 border-r-input lg:flex flex-col items-center hidden',
        isCollapsed && 'min-w-14 transition-all duration-300 ease-in-out',
      )}
    >
      <div className="w-full h-14 shrink-0 border-b border-b-input">
        <SidebarOrganization isCollapsed={isCollapsed} />
      </div>
      <SidebarNavigation isCollapsed={isCollapsed} />
    </ResizablePanel>
  );
}

function SidebarOrganization(props: { isCollapsed: boolean }) {
  return (
    <div className="p-2.5 flex items-center justify-center">
      <OrgCombobox isCollapsed={props.isCollapsed} />
    </div>
  );
}

function SidebarNavigation(props: { isCollapsed: boolean }) {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex h-full p-2.5"></div>
      <div className="flex flex-col gap-2 p-2.5 border-t border-t-input">
        <Button
          asChild
          variant="ghost"
          size={props.isCollapsed ? 'icon' : 'default'}
          className={cn(
            'flex items-center gap-2',
            props.isCollapsed ? 'justify-center' : 'text-start justify-start',
          )}
        >
          <Link to="/settings/general">
            <PiGearSix className="h-4 w-4" />
            {!props.isCollapsed && t('erp:settings.title')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
