"use client";
import { PATHS, PATH_TITLE } from "@/lib/constants";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSnackbar } from "notistack";
import { forwardRef, ReactNode, useCallback } from "react";
import { HelpIcon, SubscriptionIcon } from "./Icons";

interface ISideNavProps {
  onNavHandler: Function;
}

const StyledLink = ({
  pathname,
  href,
  label,
  children,
  onNav,
}: {
  pathname: string | null;
  href: string;
  label: string;
  children: ReactNode;
  onNav: Function;
}) => {
  return (
    <Link
      onClick={() => onNav(label)}
      href={href}
      className={`flex items-center p-2 mob-max:p-2 text-tc-base rounded-lg hover:bg-gray-100 ${
        pathname === href ? "font-bold" : "font-normal"
      }`}
    >
      {children}
      <span className="ml-3 mob-max:hidden">{label}</span>
    </Link>
  );
};

const SideNav = forwardRef<HTMLInputElement, ISideNavProps>(
  ({ onNavHandler }, ref) => {
    const { data: session } = useSession();
    const pathname = usePathname();
    const { enqueueSnackbar } = useSnackbar();

    const logout = useCallback(() => {
      enqueueSnackbar("Logged out!");
      signOut({ callbackUrl: "/" });
    }, [enqueueSnackbar]);

    let navComponent = (
      <div>
        <aside
          ref={ref}
          id="default-sidebar"
          className="mob-max:hidden bg-white fixed top-0 left-0 z-50 w-72 h-full border-r border-[#DEE3E9] shadow-md sm:shadow-none"
          aria-label="Sidebar"
        >
          <div className="h-full flex flex-col px-8 py-6 overflow-y-auto transition-all duration-[400ms]">
            <div className="flex justify-between">
              <Image
                width={280}
                height={0}
                src="/ContentForm-Beta.png"
                alt="contentform logo"
              />
            </div>
            <div className="h-full mt-14 flex flex-col justify-between">
              <ul className="flex-grow space-y-2">
                <li>
                  <StyledLink
                    onNav={onNavHandler}
                    pathname={pathname}
                    href={PATHS.CREATE}
                    label={PATH_TITLE.CREATE}
                  >
                    <Image
                      src={
                        pathname === PATHS.CREATE
                          ? "/icons/CreateContentActive.svg"
                          : "/icons/CreateContentInActive.svg"
                      }
                      width={24}
                      height={24}
                      alt="Create Content"
                    />
                  </StyledLink>
                </li>
                <li>
                  <StyledLink
                    onNav={onNavHandler}
                    pathname={pathname}
                    href={PATHS.MY_VIDEOS}
                    label={PATH_TITLE.MY_VIDEOS}
                  >
                    <Image
                      src={
                        pathname === PATHS.MY_VIDEOS
                          ? "/icons/MyContentActive.svg"
                          : "/icons/MyContentInactive.svg"
                      }
                      width={24}
                      height={24}
                      alt="Create Content"
                    />
                  </StyledLink>
                </li>
                <li>
                  <StyledLink
                    onNav={onNavHandler}
                    pathname={pathname}
                    href={PATHS.SUBSCRIPTION}
                    label={PATH_TITLE.SUBSCRIPTION}
                  >
                    <SubscriptionIcon bold={pathname === PATHS.SUBSCRIPTION} />
                  </StyledLink>
                </li>
                <li>
                  <StyledLink
                    onNav={onNavHandler}
                    pathname={pathname}
                    href={PATHS.HELP}
                    label={PATH_TITLE.HELP}
                  >
                    <HelpIcon bold={pathname === PATHS.HELP} />
                  </StyledLink>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <div className="flex justify-start">
                    <div
                      className={`relative inline-flex items-center justify-center mr-2 h-[32px] overflow-hidden bg-tc-user rounded-full ${
                        session?.user?.avatar ? "w-[32px]" : "w-1"
                      }`}
                    >
                      {session?.user?.avatar ? (
                        <Image
                          src={session?.user?.avatar}
                          alt="avatar"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <span className="font-medium text-tc-primary"></span>
                      )}
                    </div>
                    <div>
                      <p className="text-tc-primary text-tc-base">
                        {session?.user?.name || "John Doe"}
                      </p>
                      <p className="text-[#42515E] text-xs">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
              <ul className="border-t border-tc-border mt-8 pt-8">
                <li>
                  <button
                    onClick={logout}
                    className="w-full flex items-center py-2 text-tc-base rounded-lg hover:bg-gray-100"
                  >
                    <Image
                      width={24}
                      height={24}
                      src="/logout.svg"
                      alt="Log out"
                      className="mr-3"
                    />
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        <nav
          ref={ref}
          className="hidden mob-max:block bg-white rounded-t-lg fixed h-20 bottom-0 left-0 right-0 z-40 w-full shadow-[0_-1px_6px_rgba(69,72,75,0.3)]"
        >
          <div className="mt-2 w-full flex justify-around">
            <div>
              <StyledLink
                onNav={onNavHandler}
                pathname={pathname}
                href={PATHS.CREATE}
                label={PATH_TITLE.CREATE}
              >
                <Image
                  src={
                    pathname === PATHS.CREATE
                      ? "/icons/CreateContentActive.svg"
                      : "/icons/CreateContentInActive.svg"
                  }
                  width={24}
                  height={24}
                  alt="Create Content"
                />
              </StyledLink>
            </div>
            <div>
              <StyledLink
                onNav={onNavHandler}
                pathname={pathname}
                href={PATHS.MY_VIDEOS}
                label={PATH_TITLE.MY_VIDEOS}
              >
                <Image
                  src={
                    pathname === PATHS.MY_VIDEOS
                      ? "/icons/MyContentActive.svg"
                      : "/icons/MyContentInactive.svg"
                  }
                  width={24}
                  height={24}
                  alt="Create Content"
                />
              </StyledLink>
            </div>
            <div>
              <StyledLink
                onNav={onNavHandler}
                pathname={pathname}
                href={PATHS.SUBSCRIPTION}
                label={PATH_TITLE.SUBSCRIPTION}
              >
                <SubscriptionIcon bold={pathname === PATHS.SUBSCRIPTION} />
              </StyledLink>
            </div>
            {/* <div>
            <StyledLink
              onNav={onNavHandler}
              pathname={pathname}
              href={PATHS.HELP}
              label={PATH_TITLE.HELP}
            >
              <HelpIcon bold={pathname === PATHS.HELP} />
            </StyledLink>
          </div> */}
          </div>
        </nav>
      </div>
    );
    return navComponent;
  }
);

SideNav.displayName = "SideNav";

export default SideNav;
