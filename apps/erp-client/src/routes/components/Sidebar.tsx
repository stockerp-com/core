import { ResizablePanel } from '@core/ui/components/ui/resizable';
import { cn } from '@core/ui/lib/utils';
import { useState } from 'react';
import { Button } from '@core/ui/components/ui/button';
import { Link } from '@tanstack/react-router';
import { PiGearSix } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';

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
        'border-r bg-card z-10 lg:flex flex-col items-center hidden',
        isCollapsed && 'min-w-16 transition-all duration-300 ease-in-out',
      )}
    >
      <div className="w-full h-16 shrink-0 border-b">
        {/* <SidebarOrganization isCollapsed={isCollapsed} /> */}
      </div>
      <SidebarNavigation isCollapsed={isCollapsed} />
    </ResizablePanel>
  );
}

function SidebarNavigation(props: { isCollapsed: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex h-full p-3"></div>
      <div className="flex flex-col gap-2 p-3 border-t">
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
            {!props.isCollapsed && t('content:erp.settings.title')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
