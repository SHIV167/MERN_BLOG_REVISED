import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const SkillsSection = () => {
  // Fetch skills by category
  const { data: frontendSkills, isLoading: frontendLoading } = useQuery({
    queryKey: ['/api/skills', { category: 'frontend' }],
  });

  const { data: backendSkills, isLoading: backendLoading } = useQuery({
    queryKey: ['/api/skills', { category: 'backend' }],
  });

  const { data: additionalSkills, isLoading: additionalLoading } = useQuery({
    queryKey: ['/api/skills', { category: 'additional' }],
  });

  // Loading skeleton for skill bars
  const SkillSkeleton = () => (
    <div>
      <div className="flex justify-between items-center py-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-2 w-full mb-4" />
    </div>
  );

  // Render skill item with percentage
  const SkillItem = ({ name, percentage }: { name: string; percentage: number }) => (
    <div>
      <div className="flex justify-between items-center py-2">
        <span className="font-medium">{name}</span>
        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded">{percentage}%</span>
      </div>
      <div className="w-full bg-white/20 h-2 rounded-full mb-4">
        <div className="bg-white h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );

  return (
    <section id="skills" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-poppins font-bold text-primary text-center mb-12">My Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Frontend Skills */}
          <div className="bg-secondary/90 rounded-lg p-6 text-white">
            <h3 className="text-xl font-poppins font-bold mb-4 uppercase">Frontend</h3>
            {frontendLoading ? (
              Array(4).fill(0).map((_, i) => <SkillSkeleton key={i} />)
            ) : (
              frontendSkills?.map((skill) => (
                <SkillItem key={skill.id} name={skill.name} percentage={skill.percentage} />
              ))
            )}
          </div>
          
          {/* Backend Skills */}
          <div className="bg-primary rounded-lg p-6 text-white">
            <h3 className="text-xl font-poppins font-bold mb-4 uppercase">Backend</h3>
            {backendLoading ? (
              Array(4).fill(0).map((_, i) => <SkillSkeleton key={i} />)
            ) : (
              backendSkills?.map((skill) => (
                <SkillItem key={skill.id} name={skill.name} percentage={skill.percentage} />
              ))
            )}
          </div>
          
          {/* Additional Skills */}
          <div className="bg-accent rounded-lg p-6 text-white">
            <h3 className="text-xl font-poppins font-bold mb-4 uppercase">Additional</h3>
            {additionalLoading ? (
              Array(4).fill(0).map((_, i) => <SkillSkeleton key={i} />)
            ) : (
              additionalSkills?.map((skill) => (
                <SkillItem key={skill.id} name={skill.name} percentage={skill.percentage} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
