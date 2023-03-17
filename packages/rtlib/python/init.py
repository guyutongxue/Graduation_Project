import argparse
from compare import compare_image

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("standard_image")
    parser.add_argument("test_image")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    shape_similarity, image_similarity, position_similarity, background_similarity, object_number_diff, total = compare_image(args.standard_image, args.test_image)

    if args.verbose:
        print("Shape similarity: ", shape_similarity)
        print("Image similarity: ", image_similarity)
        print("Position similarity: ", position_similarity)
        print("Background similarity: ", background_similarity)
        print("Object number difference: ", object_number_diff)
        print("Total: ", total)
    else:
        print(total)
