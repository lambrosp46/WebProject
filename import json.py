import json

# Input JSON file name
input_file = "data.json"

# Output SQL commands file
output_file = "insert_commands.txt"

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

sql_lines = []

# Generate INSERT commands for students
for student in data.get("students", []):
    sql = (
        "INSERT INTO students (name, surname, student_number, street, number, city, postcode, father_name, landline_telephone, mobile_telephone, email) "
        f"VALUES ('{student['name']}', '{student['surname']}', '{student['student_number']}', "
        f"'{student['street']}', '{student['number']}', '{student['city']}', '{student['postcode']}', "
        f"'{student['father_name']}', '{student['landline_telephone']}', '{student['mobile_telephone']}', '{student['email']}');"
    )
    sql_lines.append(sql)

# Generate INSERT commands for professors
for professor in data.get("professors", []):
    sql = (
        "INSERT INTO professors (name, surname, email, topic, landline, mobile, department, university) "
        f"VALUES ('{professor['name']}', '{professor['surname']}', '{professor['email']}', "
        f"'{professor['topic']}', '{professor['landline']}', '{professor['mobile']}', "
        f"'{professor['department']}', '{professor['university']}');"
    )
    sql_lines.append(sql)

# Write to output file
with open(output_file, "w", encoding="utf-8") as f:
    for line in sql_lines:
        f.write(line + "\n")

print(f"✅ SQL commands written to: {output_file}")
