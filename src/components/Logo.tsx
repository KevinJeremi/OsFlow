import { Workflow } from "lucide-react";
import Link from "next/link";

interface LogoProps {
    href?: string;
    className?: string;
    showIcon?: boolean;
}

export const Logo = ({
    href = "/",
    className = "flex items-center gap-2.5",
    showIcon = true
}: LogoProps) => {
    const content = (
        <div className={className}>
            {showIcon && (
                <div className="bg-sky-500 rounded-lg p-2 rotate-3 shadow-lg shadow-sky-500/20">
                    <Workflow className="w-5 h-5 text-white" />
                </div>
            )}
            <span className="text-2xl font-bold text-black tracking-tight">
                Os<span className="text-sky-500">Flow</span>
            </span>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
};

export default Logo;
