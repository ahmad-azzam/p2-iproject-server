const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { Student, Class, StudentClass } = require('../models');

class StudentController {
    static async register(req, res, next) {
        const { email, password, name, phoneNumber } = req.body
        try {
            const result = await Student.create({
                email, password, name, phoneNumber, role: 'student'
            })
            res.status(201).json({ email: result.email, name: result.name })
        } catch (err) {
            next(err)
        }
    }
    static async login(req, res, next) {
        const { email, password } = req.body
        try {
            const student = await Student.findOne({ where: { email } })
            if (student) {
                if (comparePassword(password, student.password)) {
                    const access_token = signToken({
                        id: student.id,
                        email: student.email,
                        role: student.role
                    })
                    res.status(200).json({ access_token })
                } else {
                    throw { name: 'Wrong Email/Password' }
                }
            } else {
                throw { name: 'Wrong Email/Password' }
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
    static async joinClass(req, res, next) {
        const idClass = req.params.id
        const idStudent = req.user.id
        try {
            const result = await Class.findByPk(idClass)
            if (result) {
                const newStudentClass = {
                    ClassId: idClass,
                    StudentId: idStudent,
                    score1: 0,
                    score2: 0,
                    score3: 0,
                    score4: 0,
                    score5: 0,
                    totalScore: 0,
                    predikat: '-',
                    status: 'waiting'
                }
                await StudentClass.create(newStudentClass)
                res.status(201).json({ message: 'Success join class' })
            } else {
                throw { name: 'Not Found' }
            }
        } catch (err) {
            next(err)
        }
    }
}

module.exports = StudentController