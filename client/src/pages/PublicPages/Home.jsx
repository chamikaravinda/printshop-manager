import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import FooterComponent from "../../components/Footer";
import { primary_gradient } from "../../utils/commonConstants";

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        <div className="flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto text-center items-center">
          <img src="/logo.png" />
          <h1 className="text-2xl md:text-4xl font-bold lg:text-6xl text-slate-700 dark:text-gray-600">
            Offset & Screen Printer
          </h1>
          <p className="text-slate-700 text-sm md:text-lg dark:text-gray-600">
            Labels | Bar codes | Stickers | Leaflet | Posters | Hang Tags
          </p>
          <Link to="/">
            <Button type="submit" className={`${primary_gradient}`}>
              Explore
            </Button>
          </Link>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
