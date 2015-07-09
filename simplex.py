from cassowary import SimplexSolver, Variable
import numpy as np

solver = SimplexSolver()

#create variables with default value
x1 = Variable('x1')
x2 = Variable('x2')
z1 = Variable('z1')
z2 = Variable('z2')
z = Variable('z')

#known variables
num = 2
c = np.array([9, 1])
m = np.array([1, 2])
ub = np.array([10, 3])
max_profit = sum(ub - c)
max_total_residues = max_profit + sum(c - m)
profit = 0
total_residues = profit + sum(c - m)
avg = total_residues*1.0/num

solver.add_constraint(z1 <= avg + x1)
solver.add_constraint(x1 + z1 >= avg)
solver.add_constraint(z2 <= avg + x2)
solver.add_constraint(x2 + z2 >= avg)
solver.add_constraint(x1 + x2 == total_residues)
solver.add_constraint(x1 + m[0] <= ub[0])
solver.add_constraint(x2 + m[1] <= ub[1])
solver.add_constraint(x1 >= 0)
solver.add_constraint(x2 >= 0)
solver.add_constraint(z1 >= 0)
solver.add_constraint(z2 >= 0)
solver.add_constraint(z1 + z2 == z)
solver.optimize(z)

print x1.value
print x2.value
print z1.value
print z2.value
print z.value