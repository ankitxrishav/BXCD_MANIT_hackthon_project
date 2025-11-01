
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
    {
        quote: "Emodash has been a game-changer for my mental wellness. The AI is so understanding, and the suggestions are genuinely helpful.",
        name: "Jessica Miller",
        title: "App User",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
        quote: "I love tracking my mood over time. It's helped me see patterns I never noticed before. Highly recommend this app to anyone.",
        name: "David Chen",
        title: "Student",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d"
    },
    {
        quote: "As someone who is often hesitant to talk about my feelings, the privacy and non-judgmental nature of Emodash have made all the difference.",
        name: "Sarah Jones",
        title: "Designer",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d"
    }
]


export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                    Loved by Users Worldwide
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Don't just take our word for it. Here's what our users have to say about their journey with Emodash.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="glass-card">
                        <CardContent className="p-6">
                            <p className="text-foreground/80">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4 mt-6">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
  );
}
