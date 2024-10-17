"use client";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowLeft, IconBrandTabler, IconMenu2, IconSettings, IconUserBolt, IconX } from "@tabler/icons-react";
import Image from "next/image"
import { CourseDetailsType } from "@/types/courseDetails";
import { Separator } from "@radix-ui/react-separator";
import { CourseType } from "@/types/course";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { CardHeader, Card, CardTitle, CardDescription, CardContent } from "../ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { getQuiz, squiz } from "@/actions/teacher/fetchQuiz";
import { error } from "console";
import { Branch, Course } from "@prisma/client";
import exp from "constants";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

//exports function for sidebar 
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

//sidebarprovider 
export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden  md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps & { onClick?: () => void };
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
      onClick={link.onClick}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export function SidebarComponent({ allCourses }: { allCourses: CourseDetailsType }) {
  const courses: { course: CourseType }[] = allCourses.courses;
  const branch = allCourses.branch?.code;
  const extractedCourses = courses.map((item) => item.course);
  const studentName: string = allCourses.name;
  const usn = allCourses.usn;



  const links = [
    {
      label: "Dashboard",
      href: "profiledashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    // {
    //   label: "Settings",
    //   href: "#",
    //   icon: (
    //     <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    {
      label: "Logout",
      href: "",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => { signOut() },
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen w-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: studentName,
                href: "",
                icon: (
                  <Image
                    src=""
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
        <MainContent extractedCourses={extractedCourses} name={studentName} usn={usn} branch={branch} />
      </Sidebar>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const MainContent = ({ extractedCourses, name, usn, branch }: { extractedCourses: CourseType[], name: String, usn: string, branch?: Branch['code'] }) => {
  return (
    <div className="w-screen">
      {/* <CoursesCard extractedCourses={extractedCourses} /> */}
      <div className="sm:pt-10 sm:px-5 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 gap-2 w-full h-screen">
        <div className=""><CoursesCard extractedCourses={extractedCourses} name={name} usn={usn} branch={branch} /></div>
        <Separator className="my-4" orientation="horizontal" />
      </div>
      {/* <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full"> */}
      {/* </div> */}
    </div>
  );
};

const CoursesCard = ({ extractedCourses, name, usn, branch }: { extractedCourses: CourseType[], name: String, usn: string, branch?: Branch['code'] }) => {
  const router = useRouter();
  const [upcomingQuizzes, setQuizzes] = useState<squiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const handleClick = (id: string, usn: string) => {
    router.push(`dashboard`)
  }

  const isExpired = ({ quizId, quizDate, quizTime, attempted }: { quizId: number, quizDate: Date, quizTime: Date, attempted: boolean }) => {
    const endtime = new Date(quizDate)
    endtime.setTime(quizTime.getTime())
    const now = new Date();
    const expired = now > endtime
    console.log("Attempted status is" + attempted);
    return (
      <div>
        {expired ? (
          <Button variant="outline" size="sm" className="mt-2" >
            Quiz has expired contact Instructor
          </Button>
        ) : (
          attempted ? (
            <Button variant="outline" size="sm" className="mt-2" >
              Already attempted
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="mt-2" onClick={() => { router.push(`/quiz?quizId=${quizId}`) }}>
              Take quiz
            </Button>
          )
        )}
      </div>
    )
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true)
      const ids = extractedCourses.map(course => course.courseId)
      console.log("Fetching quizzes for courses:", ids)
      const quizzes = await getQuiz({ courses: ids, branch: branch })
      if (Array.isArray(quizzes)) {
        console.log("Quizzes fetched successfully:", quizzes)
        setQuizzes(quizzes)
        setError(null)
      } else {
        console.error("Error fetching quizzes:", quizzes.error)
        setError(quizzes.error)
      }
      setLoading(false)
    }

    fetchQuizzes()
  }, [extractedCourses])

  console.log("Rendering CoursesCard with quizzes:", upcomingQuizzes)

  return <div className="mx-auto">
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4 ml-1">
        <TabsTrigger value="courses" className="data-[state=active]:bg-primary rounded-xl data-[state=active]:text-primary-foreground shadow border mr-2 p-1">Courses</TabsTrigger>
        <TabsTrigger value="quizzes" className="data-[state=active]:bg-primary rounded-xl data-[state=active]:text-primary-foreground shadow border ml-2 p-1">Upcoming Quizzes</TabsTrigger>
      </TabsList>
      <TabsContent value="courses">
        <Card>
          <CardHeader>
            <CardTitle>Welcome {name}</CardTitle>
            <CardDescription>Courses you are currently enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] md:h-[400px] overflow-y-auto 
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              dark:[&::-webkit-scrollbar-track]:bg-neutral-700
              dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <ul className="space-y-4 mr-2">
                {extractedCourses.map((course) => (
                  <li key={course.courseId} className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-md shadow">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instructor: John Doe</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleClick(course.courseId, usn)}>
                      View Details
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="quizzes">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Quizzes</CardTitle>
            <CardDescription>Scheduled quizzes for your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] md:h-[400px] overflow-y-auto 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              {loading ? (
                <p className="text-center">Loading quizzes...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : upcomingQuizzes.length === 0 ? (
                <p className="text-center">No upcoming quizzes found.</p>
              ) : (
                <ul className="space-y-4 mr-2">
                  {upcomingQuizzes.map((quiz) => (
                    <li key={quiz.id} className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-md shadow">
                      <h3 className="font-semibold text-lg">{quiz.title}</h3> {/* Apply font styles here */}
                      <p className="text-sm text-gray-600 dark:text-gray-400">Course: {quiz.course.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Date: {new Date(quiz.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Time: {new Date(quiz.startTime).toLocaleTimeString()} - {new Date(quiz.endTime).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {quiz.duration} minutes</p>
                      <div>
                        {isExpired({ quizId: quiz.id, quizDate: quiz.date, quizTime: quiz.endTime, attempted: quiz.attempted })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  </div>
}
