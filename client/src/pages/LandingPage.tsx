const LandingPage = () => {
  return (
    <main className="min-h-screen bg-ivory dark:bg-navy-950">
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-navy-900 dark:text-white">
            CompileX
          </h1>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            Turn Ideas Into Better Code.
          </p>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;