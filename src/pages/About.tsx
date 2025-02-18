
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-[#1a365d] mb-12">About Us</h1>
        
        <Card className="border-2 border-[#1a365d]">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We are dedicated to transforming education through innovative technology. Our platform connects teachers and students in a dynamic learning environment, making education more accessible and engaging for everyone.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-[#1a365d]">
            <CardHeader>
              <CardTitle>For Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We provide powerful tools to create interactive lessons, track student progress, and manage virtual classrooms effectively. Our platform helps teachers focus on what matters most: teaching.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#1a365d]">
            <CardHeader>
              <CardTitle>For Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Students gain access to engaging learning materials, interactive exercises, and immediate feedback. Our platform adapts to each student's pace, ensuring an optimal learning experience.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-[#1a365d]">
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We envision a future where quality education knows no boundaries. Through continuous innovation and dedication to our users, we strive to make this vision a reality.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
