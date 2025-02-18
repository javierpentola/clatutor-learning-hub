
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const translations = {
  en: {
    title: "About Us",
    mission: {
      title: "Our Mission",
      content: "We are dedicated to transforming education through innovative technology. Our platform connects teachers and students in a dynamic learning environment, making education more accessible and engaging for everyone."
    },
    forTeachers: {
      title: "For Teachers",
      content: "We provide powerful tools to create interactive lessons, track student progress, and manage virtual classrooms effectively. Our platform helps teachers focus on what matters most: teaching."
    },
    forStudents: {
      title: "For Students",
      content: "Students gain access to engaging learning materials, interactive exercises, and immediate feedback. Our platform adapts to each student's pace, ensuring an optimal learning experience."
    },
    vision: {
      title: "Our Vision",
      content: "We envision a future where quality education knows no boundaries. Through continuous innovation and dedication to our users, we strive to make this vision a reality."
    }
  },
  es: {
    title: "Sobre Nosotros",
    mission: {
      title: "Nuestra Misión",
      content: "Estamos dedicados a transformar la educación a través de tecnología innovadora. Nuestra plataforma conecta a profesores y estudiantes en un entorno de aprendizaje dinámico, haciendo la educación más accesible y atractiva para todos."
    },
    forTeachers: {
      title: "Para Profesores",
      content: "Proporcionamos herramientas potentes para crear lecciones interactivas, seguir el progreso de los estudiantes y gestionar aulas virtuales de manera efectiva. Nuestra plataforma ayuda a los profesores a centrarse en lo más importante: enseñar."
    },
    forStudents: {
      title: "Para Estudiantes",
      content: "Los estudiantes obtienen acceso a materiales de aprendizaje atractivos, ejercicios interactivos y retroalimentación inmediata. Nuestra plataforma se adapta al ritmo de cada estudiante, asegurando una experiencia de aprendizaje óptima."
    },
    vision: {
      title: "Nuestra Visión",
      content: "Imaginamos un futuro donde la educación de calidad no conoce fronteras. A través de la innovación continua y la dedicación a nuestros usuarios, nos esforzamos por hacer realidad esta visión."
    }
  },
  vi: {
    title: "Về Chúng Tôi",
    mission: {
      title: "Sứ Mệnh",
      content: "Chúng tôi tận tâm trong việc chuyển đổi giáo dục thông qua công nghệ đổi mới. Nền tảng của chúng tôi kết nối giáo viên và học sinh trong một môi trường học tập năng động, làm cho giáo dục trở nên dễ tiếp cận và hấp dẫn hơn cho tất cả mọi người."
    },
    forTeachers: {
      title: "Dành Cho Giáo Viên",
      content: "Chúng tôi cung cấp các công cụ mạnh mẽ để tạo các bài học tương tác, theo dõi tiến độ của học sinh và quản lý lớp học ảo một cách hiệu quả. Nền tảng của chúng tôi giúp giáo viên tập trung vào điều quan trọng nhất: giảng dạy."
    },
    forStudents: {
      title: "Dành Cho Học Sinh",
      content: "Học sinh được tiếp cận với tài liệu học tập hấp dẫn, bài tập tương tác và phản hồi ngay lập tức. Nền tảng của chúng tôi thích ứng với tốc độ của từng học sinh, đảm bảo trải nghiệm học tập tối ưu."
    },
    vision: {
      title: "Tầm Nhìn",
      content: "Chúng tôi hướng tới một tương lai nơi giáo dục chất lượng không có giới hạn. Thông qua đổi mới liên tục và sự tận tâm với người dùng, chúng tôi phấn đấu để biến tầm nhìn này thành hiện thực."
    }
  }
};

const About = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("language") || "en";
      setLanguage(newLang);
    };

    handleLanguageChange();
    window.addEventListener("languageChange", handleLanguageChange);
    return () => window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  const t = translations[language as keyof typeof translations];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-[#1a365d] mb-12">{t.title}</h1>
        
        <Card className="border-2 border-[#1a365d]">
          <CardHeader>
            <CardTitle>{t.mission.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t.mission.content}
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-[#1a365d]">
            <CardHeader>
              <CardTitle>{t.forTeachers.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t.forTeachers.content}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#1a365d]">
            <CardHeader>
              <CardTitle>{t.forStudents.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t.forStudents.content}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-[#1a365d]">
          <CardHeader>
            <CardTitle>{t.vision.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t.vision.content}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
