import { ResizablePanel } from '@retailify/ui/components/ui/resizable';
import { cn } from '@retailify/ui/lib/utils';
import { useState } from 'react';
import DisplayUser from './DisplayUser';
import SettingsMenu from './Settings';

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
        'bg-background border-r border-r-input lg:flex flex-col items-center hidden',
        isCollapsed && 'min-w-14 transition-all duration-300 ease-in-out',
      )}
    >
      <div className="w-full h-14 shrink-0 border-b border-b-input">
        <SidebarOrganization />
      </div>
      <SidebarNavigation isCollapsed={isCollapsed} />
    </ResizablePanel>
  );
}

function SidebarOrganization() {
  return <></>;
}

function SidebarNavigation(props: { isCollapsed: boolean }) {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex h-full p-2.5"></div>
      <div className="flex flex-col gap-2 p-2.5 border-t border-t-input">
        <DisplayUser isCollapsed={props.isCollapsed} />
        <SettingsMenu isCollapsed={props.isCollapsed} />
      </div>
    </div>
  );
}
