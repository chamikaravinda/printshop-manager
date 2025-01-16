import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import FooterComponent from "../components/Footer";

export default function Home() {
  
  return (
    <>
      <div className="min-h-screen">
        <div className="flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold lg:text-6xl">
            Welcome to React Node Boilerplate
          </h1>
          <p className="text-gray-500 text-sm md:text-lg">
            This is a boiler plate for React and Node.js. It is a full stack.
            Includes firebase firestore, authentication, redux, react-router-dom
          </p>
          <Link to="/">
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
              Explore
            </Button>
          </Link>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
