import { comparePassword, hashPassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/mongoose/user.model.js";

export const register = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    employee_number,
    first_name,
    last_name,
    phone,
  } = req.body;
  try {
    // TODO: crear usuario con password hasheada y profile embebido

    //* Hashear contraseña
    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
      employee_number: employee_number,
      first_name: first_name,
      last_name: last_name,
      phone: phone,
    });

    return res.status(201).json({ msg: "Usuario registrado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // TODO: buscar user, validar password, firmar JWT y setear cookie httpOnly
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario o contraseña incorrecta",
      });
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario o contraseña incorrecta",
      });
    }

    const token = signToken({
      id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    return res.status(200).json({ msg: "Usuario logueado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {
    // TODO: devolver profile del user logueado actualmente
    const userLogged = req.user;

    const profile = await UserModel.findOne({ _id: userLogged._id }).select(
      "profile"
    );
    return res.status(200).json({ data: profile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie("token");
  return res.status(204).json({ msg: "Sesión cerrada correctamente" });
};
