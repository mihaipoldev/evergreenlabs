export default function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center bg-background px-4 py-20">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Evergreen Labs
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Welcome to Evergreen Labs. Building the future, one project at a time.
          </p>
        </div>
      </section>

      {/* Content Section 1 */}
      <section className="bg-muted/50 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-8 text-3xl font-bold text-foreground sm:text-4xl">
            Section 1
          </h2>
          <p className="text-lg text-muted-foreground">
            This is a placeholder section. Content will be added here.
          </p>
        </div>
      </section>

      {/* Content Section 2 */}
      <section className="bg-background px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-8 text-3xl font-bold text-foreground sm:text-4xl">
            Section 2
          </h2>
          <p className="text-lg text-muted-foreground">
            This is another placeholder section. Content will be added here.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <section className="bg-muted/50 px-4 py-12">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Evergreen Labs. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
