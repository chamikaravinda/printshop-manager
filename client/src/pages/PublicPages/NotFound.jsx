import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { primary_gradient } from "../../utils/commonConstants";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto">
        <h1 className="font-bold text-9xl">404</h1>
        <Link to="/">
          <Button type="submit" className={primary_gradient} outline>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
