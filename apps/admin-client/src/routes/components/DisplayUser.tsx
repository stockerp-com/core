import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@retailify/ui/components/ui/avatar';
import { trpc } from '../../utils/trpc';
import { getNameShorthand } from '../../utils/ui';
import { Skeleton } from '@retailify/ui/components/ui/skeleton';

export default function DisplayUser(props: { isCollapsed: boolean }) {
  const { data, isLoading, isError } = trpc.employee.findMe.useQuery();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-9 w-9 flex rounded-md">
        <AvatarImage
          className="rounded-md"
          src={`${import.meta.env.VITE_CDN_URL}/${data?.employee?.picture?.key}`}
        />
        <AvatarFallback className="text-muted-foreground rounded-md">
          {data?.employee?.fullName &&
            getNameShorthand(data?.employee?.fullName)}
        </AvatarFallback>
      </Avatar>
      {isLoading && !props.isCollapsed ? (
        <Skeleton className="h-4 w-36" />
      ) : isError && !props.isCollapsed ? (
        <span className="text-destructive">Error :(</span>
      ) : (
        !props.isCollapsed && (
          <span className="text-sm line-clamp-1">
            {data?.employee?.fullName}
          </span>
        )
      )}
    </div>
  );
}
