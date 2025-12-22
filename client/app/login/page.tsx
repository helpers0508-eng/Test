import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden p-4">
      <div className="flex w-full max-w-[1024px] overflow-hidden rounded-xl bg-white shadow-plum dark:bg-background-dark dark:border dark:border-gray-700">
        <LoginForm />
        <div className="hidden w-1/2 bg-cover bg-center bg-no-repeat lg:block" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC8Bsa2QzkwsynL4KNeHq0HDOP867Ay6UxGhIg1IHoj5GExBX0XNUBcraFr3X_HFw0TR3AjzD_pOwXYWSBzh8w9MdHykZ8DFQJiPosNJldl0SNccMXhS6nAOhlDN50DqQlD7qA2dl5bSzElPT6N118W5zRirZhXeL8DUVEx3fA7YUCa8oaLub-NpfimaxEfPiWTWUnlDgSvI5ZxiSnyo5jBykMMccb4BthukXM-q7UkQ1zAaEngSy43GXX44_HsszpBy0QScxOtmMk")'}}>
        </div>
      </div>
    </div>
  )
}