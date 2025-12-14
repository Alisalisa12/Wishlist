import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateWishlist from "./CreateWishlists";

jest.mock("../../components/Header/Header", () => ({
  Header: () => <header>Header</header>,
}));

jest.mock("../../components/Footer/Footer", () => ({
  Footer: () => <footer>Footer</footer>,
}));

jest.mock("../../services/wishlistStorage", () => ({
  createWishlist: jest.fn(),
}));

describe("CreateWishlist page", () => {
  // Пропускаем этот тест из-за проблемы окружения React (Invalid hook call)
  test.skip("показывает сообщения об ошибке при отправке пустой формы", () => {
    render(
      <MemoryRouter>
        <CreateWishlist />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", { name: /создать вишлист/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Введите название вишлиста/i)).toBeInTheDocument();
    expect(screen.getByText(/Выберите дату/i)).toBeInTheDocument();
    expect(screen.getByText(/Выберите настройки доступа/i)).toBeInTheDocument();
  });
});
