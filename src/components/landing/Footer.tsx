
import Logo from '@/components/layout/Logo';

export default function Footer() {
    const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <Logo />
                    <p className="text-muted-foreground text-sm max-w-xs">
                        Your AI mental wellness companion for a healthier, happier you.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 col-span-1 lg:col-span-2">
                    <div className="space-y-3">
                        <h4 className="font-semibold">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">Features</a></li>
                            <li><a href="#" className="hover:text-primary">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary">Security</a></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">About Us</a></li>
                            <li><a href="#" className="hover:text-primary">Careers</a></li>
                            <li><a href="#" className="hover:text-primary">Contact</a></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between">
                <p className="text-sm text-muted-foreground">© {currentYear} Emodash. All rights reserved.</p>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    {/* Social links can go here */}
                </div>
            </div>
        </div>
    </footer>
  );
}
