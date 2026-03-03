import { useSubscribeNL } from "@/hooks/useSubscribeNL";
import { Newsub } from "@/services/newsletter/interfaces";
import React from "react";

export const SubscribePage = () => {
  const { saveNewSub, isPending } = useSubscribeNL();


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const privacyChecked = (form.elements.namedItem("privacy") as HTMLInputElement)?.checked;

    if (!privacyChecked) {
      alert("Debes aceptar la política de privacidad");
      return;
    }

    const formData = new FormData(form);
    
    const body: Newsub = {
      email: String(formData.get("email") ?? ""),
      topics: String(formData.get("topic") ?? "") as Newsub["topics"],
      frecuency: String(formData.get("frecuency") ?? "") as Newsub["frecuency"],
    };
    saveNewSub(body);
    form.reset(); 
  };

  return (
    <>
      <section className="container-fluid px-0 px-sm-4" id="herOther">
        <div className="row p-1 p-sm-4 gy-4">
          <div className="col-12 p-2 p-sm-3 d-flex justify-content-center">
            <h1 className="h1 display-2 d-flex flex-column align-items-start p-2">
              Subscribe <br />
              now to
              <span className="alt-font">Newsletter</span>
            </h1>
          </div>
          <div className="col-12 text-primary">
            <p className="h3 p-3">
              Each One Tech One is your go-to platform for all things tech. From
              the latest gadgets to groundbreaking innovations, we bring you
              curated content to keep you ahead in the tech world. <br /> Join
              us and explore the future of technology today! Stay informed with
              the latest news, trends, and insights delivered straight to your
              inbox.
            </p>
          </div>

          <div className="col-12 col-md-4"></div>
          <div
            className="col-12 col-md-8 p-4 text-primary"
            style={{ textShadow: "1px 1px 7px rgba(255, 255, 255, 0.8)" }}
          >
            <h4 className="mb-3">Fill this Form</h4>
          </div>
          <form
            action="POST"
            className="d-flex flex-column justify-content-around align-items-start"
            onSubmit={handleSubmit}
          >
            <label className="label">e-mail</label>
            <div className="input-group mb-3 bg-secondary border border-primary border-2 rounded-5">
              <input
                required
                type="text"
                className="form-control bg-secondary rounded-5"
                aria-label="Text input with checkbox"
                name="email"
              />
            </div>
            <label className="label">
              Wich topics you prefer to stay tunned?
            </label>
            <select
              className="form-select bg-secondary border border-primary border-2 rounded-5"
              aria-label="Default select example"
              name="topic"
              defaultValue="all"
            >
              <option value="all">All</option>
              <option value="smartphone">Smartphones</option>
              <option value="app">App</option>
              <option value="gadgets">Gadgets</option>
              <option value="a.i.">A.I.</option>
              <option value="polities">Polities & Reg</option>
            </select>
            <label className="mt-4">Frecuency</label>
            <select
              className="form-select bg-secondary border border-primary border-2 rounded-5"
              aria-label="Default select example"
              name="frecuency"
              defaultValue="daily"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <div className="form-check mt-4 ms-2">
              <input
                name="privacy"
                className="form-check-input rounded-circle border border-2 border-primary"
                type="checkbox"
                value=""
                id="checkDefault"
              />
              <label className="form-check-label" htmlFor="checkDefault">
                Privacy Policy
              </label>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="m-4 btn btn-lg border border-2 border-primary rounded-pill text-primary"
            >
              {isPending ? "Enviando..." : "SUBMIT"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};
