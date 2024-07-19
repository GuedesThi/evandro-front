interface NothingLayoutProps {
    children: React.ReactNode
}

export default function NothingLayout({children}: NothingLayoutProps) {
    return (
        <main>{children}</main>
    )
}