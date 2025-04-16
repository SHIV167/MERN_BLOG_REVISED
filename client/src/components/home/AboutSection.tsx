import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const AboutSection = () => {
  // Fetch skills to determine overall skill percentage
  const { data: skills, isLoading } = useQuery({
    queryKey: ['/api/skills'],
  });

  // Calculate average skill level if skills are available
  const averageSkill = skills?.reduce((acc, skill) => acc + skill.percentage, 0) / (skills?.length || 1);
  const skillPercentage = skills ? Math.round(averageSkill) : 80; // Default to 80% if no skills
  
  return (
    <section id="about" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-8 md:mb-0">
            {isLoading ? (
              <div className="w-44 h-44 mx-auto rounded-full">
                <Skeleton className="w-full h-full rounded-full" />
              </div>
            ) : (
              <div className="skill-circle" style={{ "--percentage": `${skillPercentage}%` } as React.CSSProperties}>
                <div className="skill-content">
                  <div className="font-poppins font-bold text-primary text-lg">
                    Skills
                  </div>
                  <div className="font-poppins font-bold text-4xl text-primary">
                    {skillPercentage}%
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-poppins font-bold text-primary mb-6">About Me</h2>
            <p className="text-gray-700 mb-4">
              Graduated BE (CS) from Shah Gundecha University. Working as Frontend Developer In The Cybernative Industry. 
              My Core Experience Technology: The React JS Series | React Router DOM | ReactQuery | Redux Toolkit | TailwindCSS | React Native.
            </p>
            <p className="text-gray-700 mb-6">
              Also, sometimes I like to work on Flutter, JavaScript/TypeScript, Python, and Java. 
              I have experience in my Tech Journey as freelance developer.
            </p>
            <div className="flex flex-wrap gap-3">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-24 rounded-full" />
                ))
              ) : (
                <>
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">React</span>
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">Node.js</span>
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">MongoDB</span>
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">TailwindCSS</span>
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">JavaScript</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
