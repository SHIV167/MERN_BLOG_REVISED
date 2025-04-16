import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaBriefcase, FaNewspaper, FaVideo, FaEnvelope } from "react-icons/fa";

const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => {
    return (
      <Card>
        <CardContent className={`p-4 rounded border-l-4 ${color} flex justify-between items-center`}>
          <div>
            <p className={`text-${color.split('-')[0]}-500 font-medium`}>{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`bg-${color.split('-')[0]}-100 p-3 rounded-full`}>
            {icon}
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatSkeleton = () => (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {isLoading ? (
        <>
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </>
      ) : (
        <>
          <StatCard 
            title="Total Projects" 
            value={stats?.projectCount || 0} 
            icon={<FaBriefcase className="text-blue-500" />} 
            color="border-blue-500" 
          />
          <StatCard 
            title="Blog Posts" 
            value={stats?.blogPostCount || 0} 
            icon={<FaNewspaper className="text-green-500" />}
            color="border-green-500" 
          />
          <StatCard 
            title="YouTube Videos" 
            value={stats?.videoCount || 0} 
            icon={<FaVideo className="text-purple-500" />}
            color="border-purple-500" 
          />
          <StatCard 
            title="Unread Messages" 
            value={stats?.unreadContactCount || 0} 
            icon={<FaEnvelope className="text-red-500" />}
            color="border-red-500" 
          />
        </>
      )}
    </div>
  );
};

export default DashboardStats;
