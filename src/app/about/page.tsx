import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Cpu, Palette, Search, Clapperboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
    { name: "Ankit Kumar", role: "ML & Backend", icon: Cpu },
    { name: "Ashish Kumar Shau", role: "Frontend", icon: Palette },
    { name: "Abishek", role: "Research", icon: Search },
    { name: "Harsh", role: "UI/UX", icon: Clapperboard }
];

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-grow">
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline">
                            Our Mission
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We believe that mental wellness is a cornerstone of a happy life. Our mission is to make emotional support accessible, private, and effective for everyone, using the power of empathetic AI to foster self-awareness and growth. Emodash is more than an app; it's a companion for your journey.
                        </p>
                    </div>

                    <div className="mt-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Meet the Team
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teamMembers.map((member) => (
                                <Card key={member.name} className="text-center glass-card p-6">
                                    <CardContent className="p-0">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-2 ring-primary/20">
                                            <member.icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-xl font-bold">{member.name}</h3>
                                        <p className="text-muted-foreground">{member.role}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
